CREATE TABLE IF NOT EXISTS tsector (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    pkidtiposector         INTEGER,
    codigotiposector       TEXT,
    nombretiposector       TEXT,
    tiposectoractivo       TEXT,
    creaciontiposector     TEXT,
    modificaciontiposector TEXT,
    descripciontiposector  TEXT
);