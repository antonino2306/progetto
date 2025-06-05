const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  // Prima svuota le tabelle che hanno foreign key verso Event, Artist, Category
  db.run('DELETE FROM Partecipation');
  db.run('DELETE FROM Event');
  db.run('DELETE FROM Artist');
  db.run('DELETE FROM Category');
  db.run('DELETE FROM Show');
});

db.close(() => {
  console.log('Tutte le righe di Event, Artist e Category sono state eliminate.');
});