DROP TABLE IF EXISTS digimonTable;

CREATE TABLE IF NOT EXISTS digimonTable(
    id SERIAL PRIMARY KEY,
    digimon_name VARCHAR(255),
    digimon_img VARCHAR(255),
    digimon_level VARCHAR(255)
);