const db = require("../db.js");

class Cart {
  static async addElementToCart(userID, showID, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Cart (userID, showID, quantity)
              VALUES (?, ?, ?)`,
        [userID, showID, quantity],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async deleteElementFromCart(userID, showID) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Cart WHERE userID = ? AND showID = ?`,
        [userID, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async getCart(userID) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT S.showID as id, E.eventID, E.title, S.price, C.quantity, E.coverImage, 
                L.name as location_name, L.address, L.city, 
                (S.price*C.quantity) as total
         FROM Cart C, Event E, Show S, Location L
         WHERE C.showID = S.showID 
           AND S.eventID = E.eventID
           AND S.locationID = L.locationID 
           AND C.userID = ?`,
        [userID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async getEventByUserID(userID, showID) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT C.showID, C.quantity
            FROM Cart C
            WHERE C.userID = ? AND C.showID = ?`,
        [userID, showID],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async increaseQuantity(userID, showID, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Cart
            SET quantity = quantity + ?
            WHERE userID = ? AND showID = ?`,
        [quantity, userID, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async decreaseQuantity(userID, showID) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Cart
            SET quantity = quantity - 1
            WHERE userID = ? AND showID = ?`,
        [userID, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async clearCart(userID) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM Cart WHERE userID = ?`, [userID], (err, row) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  static async blockSeat(showID, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Show
         SET availableTickets = availableTickets - ?
         WHERE showID = ?`,
        [quantity, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async unblockSeat(showID, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Show
         SET availableTickets = availableTickets + ?
         WHERE showID = ?`,
        [quantity, showID],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

}

module.exports = Cart;
