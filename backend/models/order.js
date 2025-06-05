const db = require("../db");

class Order {

  static async createNewOrder(userID, total, pmID) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO 'Order' (userID, pmID, purchaseDate, status, total) VALUES (?, ?, ?, ?, ?)`,
        [userID, pmID, Date.now() / 1000, "paid", total],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

}

module.exports = Order;