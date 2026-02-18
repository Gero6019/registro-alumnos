const DataBase = require("better-sqlite3");
const db = new DataBase("./database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS alumnos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS asistencias(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alumno_id INTEGER NOT NULL,
        profesor_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        presente TEXT NOT NULL,
        FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
        FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password TEXT NOT NULL
    );
`)

module.exports = db;