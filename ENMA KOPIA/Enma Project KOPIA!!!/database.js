const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Tabela Users
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL UNIQUE,
        exp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        registeredAt DATETIME NOT NULL,
        joinedAt DATETIME NOT NULL,
        accountCreatedAt DATETIME NOT NULL,
        role TEXT
    )`);
    // Tabela Channels (dozwolone i zabronione kanały)
    db.run(`CREATE TABLE IF NOT EXISTS Channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channelID TEXT NOT NULL UNIQUE,
        channelName TEXT NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT 1
    )`);
});

module.exports = db;
