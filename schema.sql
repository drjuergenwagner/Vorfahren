-- Relationales Tabellen-Design für eine spätere Datenbank.
-- Für die erste GitHub-Pages-Version wird data.json verwendet.

CREATE TABLE person (
    person_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT,
    birth_date TEXT,
    birth_place_id INTEGER,
    death_date TEXT,
    death_place_id INTEGER,
    occupation TEXT,
    notes TEXT
);

CREATE TABLE place (
    place_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    municipality TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL
);

CREATE TABLE relationship (
    relationship_id INTEGER PRIMARY KEY,
    parent_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    relationship_type TEXT NOT NULL DEFAULT 'biological',
    marriage_id INTEGER,
    notes TEXT,
    FOREIGN KEY(parent_id) REFERENCES person(person_id),
    FOREIGN KEY(child_id) REFERENCES person(person_id)
);

CREATE TABLE marriage (
    marriage_id INTEGER PRIMARY KEY,
    spouse1_id INTEGER NOT NULL,
    spouse2_id INTEGER NOT NULL,
    marriage_date TEXT,
    marriage_place_id INTEGER,
    divorce_date TEXT,
    notes TEXT,
    FOREIGN KEY(spouse1_id) REFERENCES person(person_id),
    FOREIGN KEY(spouse2_id) REFERENCES person(person_id)
);

CREATE TABLE source (
    source_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    archive TEXT,
    reference TEXT,
    url TEXT,
    notes TEXT
);

CREATE TABLE person_source (
    person_id INTEGER NOT NULL,
    source_id INTEGER NOT NULL,
    page TEXT,
    citation TEXT,
    PRIMARY KEY(person_id, source_id),
    FOREIGN KEY(person_id) REFERENCES person(person_id),
    FOREIGN KEY(source_id) REFERENCES source(source_id)
);
