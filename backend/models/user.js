//importo il db
const db = require("../db");

//importo il modulo bcryptjs per la gestione delle password
const bcrypt = require("bcrypt");

class User {
  // creazione di un nuovo utente
  static async create(userData) {
    const { firstName, lastName, email, password } = userData;

    // Hash della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO User (firstName, lastName, email, password) 
        VALUES (?, ?, ?, ?)`,
        [firstName, lastName, email, hashedPassword],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  // ricerca per userID
  static async findById(userID) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT userID, firstName, lastName, email FROM User WHERE userID = ?",
        [userID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  // definisco il metodo per trovare un utente in base all'email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT userID, firstName, lastName, email, password FROM User WHERE email = ?",
        [email],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  // Metodo per aggiornare la password di un utente
  static async updatePassword(userID, oldPassword, newPassword) {
    try {
      const user = await new Promise((resolve, reject) => {
        db.get(
          "SELECT userID, password FROM User WHERE userID = ?",
          [userID],
          (err, row) => {
            if (err) reject(err);
            resolve(row);
          }
        );
      });

      if (!user) {
        throw new Error("Utente non trovato");
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        throw new Error("Password sbagliata");
      }

      // Hash della nuova password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE User SET password = ? WHERE userID = ?",
          [hashedPassword, userID],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });

      return { success: true, message: "Password aggiornata con successo" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Aggiornare la mail
  static async updateMail(userID, newMail) {
    try {
      const user = await new Promise((resolve, reject) => {
        db.get(
          "SELECT userID, email FROM User WHERE userID = ?",
          [userID],
          (err, row) => {
            if (err) reject(err);
            resolve(row);
          }
        );
      });

      if (!user) {
        throw new Error("Utente non trovato");
      }

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE User SET email = ? WHERE userID = ?",
          [newMail, userID],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });

      return { success: true, message: "Email aggiornata con successo" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  // Metodo per aggiornare la password SENZA la vecchia password (es: reset password)
  static async updatePasswordWithoutOld(userID, newPassword) {
    try {
      // Hash della nuova password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE User SET password = ? WHERE userID = ?",
          [hashedPassword, userID],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });

      return { success: true, message: "Password aggiornata con successo" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getFavoriteShows(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT
          S.showID, 
          S.startDate * 1000 AS startDate,
          S.endDate * 1000 AS endDate,
          S.price,
          availableTickets,
          totalTickets,
          L.name AS locationName,
          L.city AS locationCity,
          L.address AS locationAddress,
          L.maxCapacity AS locationMaxCapacity,
          L.coordinates AS locationCoords
        FROM User U, Favorites F, Show S, Location L
        WHERE U.userID = F.userID AND F.showID = S.showID 
        AND S.locationID = L.locationID
        AND U.userID = ?
        ORDER BY startDate ASC`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  

  static async getReviews(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT E.title, R.rate, R.description, strftime('%d/%m/%Y', R.date/1000, 'unixepoch') AS date, R.showID
        FROM Reviews R, Show S, Ticket T, Event E
        WHERE R.showID = S.showID AND S.showID = T.showID AND S.eventID = E.eventID
        AND R.userID = ?
        ORDER BY R.date DESC`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async createNewReview(userID, data) {
    const { showID, rate, description } = data;
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO 'Reviews' (userID, showID, rate, date, description) VALUES (?, ?, ?, ?, ?)`,
        [userID, showID, rate, Date.now(), description],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static async getOrders(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          O.orderID, 
          GROUP_CONCAT(DISTINCT E.title) AS eventTitles, 
          O.total, O.status, O.purchaseDate*1000 AS purchaseDate, P.cardNumber, P.pm_type, E.title, T.holderName, T.holderSurname
        FROM 'Order' O, Ticket T, Show S, Event E, PaymentMethod P
        WHERE O.orderID = T.orderID AND T.showID = S.showID AND S.eventID = E.eventID AND O.pmID = P.pmID AND O.userID = ?
        GROUP BY O.orderID
        ORDER BY O.purchaseDate DESC`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getTickets(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT T.ticketID, T.holderName, T.holderSurname, T.status, E.title, O.orderID, L.name AS locationName,
        S.startDate*1000 AS startDate, S.endDate AS endDateNC, S.showID
        FROM 'Order' O, Ticket T, Show S, Event E, Location L
        WHERE O.orderID = T.orderID AND T.showID = S.showID AND S.eventID = E.eventID AND L.locationID = S.locationID AND O.userID = ?
        ORDER BY S.startDate ASC`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async setPaymentMethod(userID, data) {
    const { type, cardNumber, expirationDate, cvc, cardHolderName, isDefault } =
      data;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO PaymentMethod (userID, pm_type, cardNumber, expirationDate, cvc, cardHolderName, isDefault)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userID,
          type,
          cardNumber,
          expirationDate,
          cvc,
          cardHolderName,
          isDefault,
        ],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async getPaymentMethods(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT pmID, pm_type, cardNumber, expirationDate, cvc, cardHolderName, isDefault
        FROM PaymentMethod
        WHERE userID = ?`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async setDefaultPaymentMethod(userID, pmID) {
    // controllo che non ci siano altri metodi di pagamento con isDefault = 1
    const checkDefault = await new Promise((resolve, reject) => {
      db.get(
        `SELECT pmID FROM PaymentMethod WHERE userID = ? AND isDefault = 1`,
        [userID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
    if (checkDefault) {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE PaymentMethod SET isDefault = 2 WHERE pmID = ?`,
          [checkDefault.pmID],
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });
    }
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE PaymentMethod SET isDefault = 1 WHERE pmID = ?`,
        [pmID],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async deletePaymentMethod(userID, pmID) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM PaymentMethod WHERE userID = ? AND pmID = ?`,
        [userID, pmID],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async deleteAccount(userID) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM User WHERE userID = ?`, [userID], function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  static async addFavoriteCategory(userID, categoryID) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO FavCategories (userID, categoryID) VALUES (?, ?)`,
        [userID, categoryID],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static getFavoriteCategories(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT C.categoryID, C.name, C.imageUrl
        FROM FavCategories FC, Category C
        WHERE FC.userID = ? AND FC.categoryID = C.categoryID`,
        [userID],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = User;
