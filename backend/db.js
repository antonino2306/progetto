const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS User 
        (
        userID INTEGER PRIMARY KEY AUTOINCREMENT, 
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        address TEXT,
        city TEXT,
        postalCode TEXT)`
    );

    db.run(`CREATE TABLE IF NOT EXISTS PaymentMethod 
        (
        pmID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        pm_type TEXT NOT NULL,
        cardNumber TEXT NOT NULL,
        expirationDate TEXT NOT NULL, -- formato 'YYYY-MM-DD'
        CVC TEXT NOT NULL,
        cardHolderName TEXT NOT NULL,
        isDefault INTEGER, -- 0 = false, 1 = true
        FOREIGN KEY (userID) REFERENCES User(userID)
        )`
    );

    db.run(`CREATE TABLE IF NOT EXISTS "Order" 
        (
        orderID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        pmID INTEGER NOT NULL,
        purchaseDate INTEGER NOT NULL, -- timestamp
        status TEXT NOT NULL, -- 'pending', 'completed', 'canceled'
        total REAL NOT NULL,
        FOREIGN KEY (userID) REFERENCES User(userID),
        FOREIGN KEY (pmID) REFERENCES PaymentMethod(pmID)
        );` 
    );

    db.run(`CREATE TABLE IF NOT EXISTS Category 
        (
        categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        imageUrl TEXT
        );
    `);

    db.run(`CREATE TABLE IF NOT EXISTS FavCategories 
        (
        categoryID INTEGER,
        userID INTEGER NOT NULL,
        PRIMARY KEY (categoryID, userID),
        FOREIGN KEY (categoryID) REFERENCES Category(categoryID),
        FOREIGN KEY (userID) REFERENCES User(userID)
        );
    `);

    db.run(`CREATE TABLE IF NOT EXISTS Location 
        (
        locationID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        maxCapacity INTEGER NOT NULL,
        coordinates TEXT
        );`
    );

    db.run(`CREATE TABLE IF NOT EXISTS Event 
        (
        eventID INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryID INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        coverImage TEXT,     
        backgroundImage TEXT, 
        FOREIGN KEY (categoryID) REFERENCES Category(categoryID)
        );`
    );

    db.run(`CREATE TABLE IF NOT EXISTS Show (
        showID INTEGER PRIMARY KEY AUTOINCREMENT,
        eventID INTEGER NOT NULL,
        locationID INTEGER NOT NULL,
        startDate INTEGER NOT NULL,
        endDate INTEGER,
        price REAL,
        availableTickets INTEGER NOT NULL,
        totalTickets INTEGER NOT NULL,
        FOREIGN KEY (eventID) REFERENCES Event(eventID),
        FOREIGN KEY (locationID) REFERENCES Location(locationID)
        );`
    );

    db.run(`CREATE TABLE IF NOT EXISTS Favorites 
        (
        userID INTEGER NOT NULL,
        showID INTEGER NOT NULL,
        PRIMARY KEY (userID, showID),
        FOREIGN KEY (userID) REFERENCES User(userID),
        FOREIGN KEY (showID) REFERENCES Show(showID)
        );`
    )

    db.run(`CREATE TABLE IF NOT EXISTS Cart 
        (
        userID INTEGER NOT NULL,
        showID INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (userID, showID),
        FOREIGN KEY (userID) REFERENCES User(userID),
        FOREIGN KEY (showID) REFERENCES Show(showID)
        );`
    );

    db.run(`CREATE TABLE IF NOT EXISTS Reviews (
        reviewID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        showID INTEGER NOT NULL,
        rate INTEGER NOT NULL,
        date INTEGER NOT NULL,
        description TEXT,
        FOREIGN KEY (userID) REFERENCES User(userID),
        FOREIGN KEY (showID) REFERENCES Show(showID)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Ticket 
        (
        ticketID INTEGER PRIMARY KEY AUTOINCREMENT,
        orderID INTEGER NOT NULL,
        showID INTEGER NOT NULL,
        holderName TEXT NOT NULL,
        holderSurname TEXT NOT NULL,
        emissionDate INTEGER NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (orderID) REFERENCES "Order"(orderID),
        FOREIGN KEY (showID) REFERENCES Show(showID)
        );`
    )

    db.run(`CREATE TABLE IF NOT EXISTS Artist 
        (
        artistID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        genre TEXT NOT NULL,
        image TEXT, 
        popularity INTEGER
        );`
    )

    db.run(`CREATE TABLE IF NOT EXISTS Partecipation 
        (
        partecipationID INTEGER PRIMARY KEY AUTOINCREMENT,
        artistID INTEGER NOT NULL,
        eventID INTEGER NOT NULL,
        role TEXT NOT NULL,
        FOREIGN KEY (artistID) REFERENCES Artist(artistID),
        FOREIGN KEY (eventID) REFERENCES Event(eventID)
        );`
    )

})

module.exports = db;