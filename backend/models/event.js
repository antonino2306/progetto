const db = require("../db");

class Event {
  static fields = `S.showID, 
        E.title, E.description, E.coverImage, E.backgroundImage, 
        S.price, S.availableTickets, S.totalTickets, 
        C.name as category, L.name as location`;

  static async getCategories() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM Category`, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async getEventDetails(eventID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT S.showID, S.startDate*1000 as startDate, S.endDate*1000 as endDate, S.price, S.availableTickets, S.totalTickets, 
                    L.name as locationName, L.city as locationCity, L.address as locationAddress, L.maxCapacity as locationMaxCapacity, L.coordinates as locationCoords
                FROM Show S, Location L
                WHERE S.eventID = ? AND S.locationID = L.locationID`,
        [eventID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getEventArtists(eventID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT A.artistID, A.name, A.type, A.genre, A.popularity, A.image
                FROM Artist A, Partecipation P
                WHERE P.eventID = ? AND P.artistID = A.artistID`,
        [eventID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async searchEvents(params) {
    // Inizializza array per le condizioni SQL e i valori parametrici
    const conditions = [];
    const values = [];

    // Query di base
    let query = `
          SELECT DISTINCT E.eventID, E.title, E.description, E.coverImage, 
            E.backgroundImage, C.name as category
          FROM Event E
          JOIN Category C ON E.categoryID = C.categoryID`;

    // Aggiungi join per altre tabelle se necessario in base ai parametri
    if (params.date || params.minPrice || params.maxPrice || params.location) {
      query += `
            JOIN Show S ON E.eventID = S.eventID`;
    }

    if (params.location) {
      query += `
            JOIN Location L ON S.locationID = L.locationID`;
    }

    // Costruisci clausola WHERE in base ai parametri forniti
    if (params.title) {
      conditions.push(`E.title LIKE ?`);
      values.push(`%${params.title}%`);
    }

    if (params.date) {
      conditions.push(`S.startDate >= ?`);
      values.push(params.date);
    }

    if (params.minPrice) {
      conditions.push(`S.price >= ?`);
      values.push(params.minPrice);
    }

    if (params.maxPrice) {
      conditions.push(`S.price <= ?`);
      values.push(params.maxPrice);
    }

    if (params.location) {
      conditions.push(`L.name LIKE ?`);
      values.push(`%${params.location}%`);
    }

    if (params.category) {
      conditions.push(`C.name = ?`);
      values.push(params.category);
    }

    // Aggiungi la clausola WHERE se ci sono condizioni
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Esegui la query
    return new Promise((resolve, reject) => {
      db.all(query, values, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async getUpcomingEvents() {
    const todayDate = new Date().getTime() / 1000;
    console.log("Today's date in seconds:", todayDate);
    const date = todayDate + 60 * 24 * 60 * 60; // 30 days in seconds
    console.log("Date 30 days from now in seconds:", date);
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT E.eventID, E.title, E.description, E.coverImage, E.backgroundImage, C.name as category
                FROM Event E, Show S, Category C
                WHERE E.eventID = S.eventID AND E.categoryID = C.categoryID AND S.startDate >= ? AND S.startDate <= ?`,
        [todayDate, date],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getPopularEvents() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT E.eventID, E.title, E.description, E.coverImage, E.backgroundImage, C.name as category
                FROM Event E, Show S, Category C, Partecipation P, Artist A
                WHERE E.eventID = S.eventID AND E.categoryID = C.categoryID
                AND P.eventID = E.eventID AND P.artistID = A.artistID
                AND S.startDate >= ?
                ORDER BY A.popularity DESC`,
        [Date.now() / 1000],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getEventsByCategory(categoryName) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT E.eventID, E.title, E.description, E.coverImage, E.backgroundImage, C.name as category
                FROM Event E, Category C, Show S
                WHERE E.categoryID = C.categoryID
                    AND C.name = ? AND S.startDate >= ?`,
        [categoryName, Date.now() / 1000],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getAvailableTickets(showID) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT availableTickets FROM Show WHERE showID = ?`,
        [showID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async addToFavorites(userID, showID) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Favorites (userID, showID) VALUES (?, ?)`,
        [userID, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async removeFromFavorites(userID, showID) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE userID = ? AND showID = ?`,
        [userID, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async isInFavorites(userID, showID) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM Favorites WHERE userID = ? AND showID = ?`,
        [userID, showID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async updateAvailableTickets(showID) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Show SET availableTickets = availableTickets - 1 WHERE showID = ? AND availableTickets > 0`,
        [showID],
        function (err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  static async getEventByShowID(showID) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT E.eventID, E.title, E.description, E.coverImage, E.backgroundImage
                FROM Event E, Show S
                WHERE S.showID = ? AND S.eventID = E.eventID`,
        [showID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async getEventByID(eventID) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT E.eventID, E.title, E.description, E.coverImage, E.backgroundImage
                FROM Event E
                WHERE E.eventID = ?`,
        [eventID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async getReviewsByShowID(showID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT R.reviewID, R.rate, R.description, R.date, U.firstName
                FROM Reviews R, User U
                WHERE R.showID = ? AND R.userID = U.userID`,
        [showID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

}

module.exports = Event;
