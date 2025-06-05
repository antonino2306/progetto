const db = require('../db');

class Ticket {

    static async create(orderID, showID, holderName, holderSurname) {
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO Ticket (orderID, showID, holderName, holderSurname, emissionDate, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [orderID, showID, holderName, holderSurname, Date.now(), "active"],
            function (err) {
              if (err) reject(err);
              resolve(this.lastID);
            }
          );
        });
      }

    static async changeHolderName(ticketID, holderName, holderSurname) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Ticket SET holderName = ?, holderSurname = ? WHERE ticketID = ?`,
                [holderName, holderSurname, ticketID],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    static async changeTicketStatus(ticketID) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Ticket SET status = 'expired' WHERE ticketID = ?`,
                [ticketID],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

}

module.exports = Ticket;