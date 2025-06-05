require('dotenv').config();

const express = require('express');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const cors = require('cors');

const path = require('path');
const fs = require('fs');

const db = require('./db');
const {isAuthenticated} = require('./middlewares/auth');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const eventRoutes = require('./routes/events');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payments');
const ticketRoutes = require('./routes/tickets');
const recoveryRoutes = require('./routes/recovery');
const imagesRoutes = require('./routes/images');


const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://localhost:8100', 'http://192.168.1.5:8100', 'http://192.168.1.9:8100', 'http://147.163.213.138:8100', 'http://147.163.216.19:8100'],
    credentials: true,
}));

app.use(express.json()); // Per parsare application/json
app.use(express.urlencoded({ extended: true })); // Per parsare application/x-www-form-urlencoded

// Controllo che la cartella che deve contentere le sessioni esista e se non esiste la creo
const sessionDir = path.join(__dirname, './sessions');
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// Configurazione del middleware per le sessioni
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: sessionDir,
        table: 'sessions',
        concurrentDB: true,
    }),
    secret: 'key', // usa una variabile d'ambiente in produzione
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usa HTTPS in produzione
        maxAge: 24 * 60 * 60 * 1000 // 24 ore
    }
}));

app.get('/', (req, res, next) => {
    const users = db.all('SELECT * FROM users', (err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
});

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/profile', isAuthenticated, profileRoutes);
app.use('/cart', isAuthenticated, cartRoutes);
app.use('/payment', isAuthenticated, paymentRoutes);
app.use('/ticket', isAuthenticated, ticketRoutes);
app.use('/recovery', recoveryRoutes);
app.use('/checkout',isAuthenticated,cartRoutes)
app.use('/images', imagesRoutes);


function updateExpiredTickets() {
    const currentTimestamp = Date.now() / 1000; // Convert milliseconds to seconds

    const query = `
        UPDATE Ticket 
        SET status = 'expired' 
        WHERE ticketID IN (
            SELECT t.ticketID 
            FROM Ticket t, Show s
            WHERE t.showID = s.showID
            AND s.endDate < ? 
            AND t.status != 'expired'
        )
    `;

    db.run(query, [currentTimestamp], function(err) {
        if (err) {
            console.error('Error updating expired tickets:', err);
        } else if (this.changes > 0) {
            console.log(`Aggiornati ${this.changes} ticket scaduti`);
        }
    });
}

updateExpiredTickets(); // Esegui subito all'avvio del server
setInterval(updateExpiredTickets, 60 * 60 * 1000); // Esegui ogni 60 minuti

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


