DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS trainer;
CREATE TABLE trainer (
    id SERIAL NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    name TEXT NOT NULL,
    value INTEGER NOT NULL,
    grade TEXT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer (id)
);

INSERT INTO trainer (first_name, last_name, email) VALUES 
('John', 'Gordinier', 'jsgordinier@gmail.com'),
('Jacob', 'Jingleheimer-Schmidt', 'jschmidt@gmail.com'),
('Inigo', 'Montoya', 'princessBride@yahoo.com'),
('Bruce', 'Banner', 'rageAndSmash@allgreen.com'),
('Peter', 'Parker', 'whyDoAllSuperheroesUseSameLetter@yahoo.com'),
('Thor', 'SonOfOdin', 'GodOfThunder@asgard.com'),
('Ryan', 'Reynolds', 'chimichangas@aol.com'),
('Tony', 'Stark', 'thatEgoOfMine@starkenterprise.com'),
('Walter', 'White', 'losPollos@Hermanos.com');

INSERT INTO cards (trainer_id, year, name, value, grade) VALUES 
(1, 2023, 'Charizard EX #228 Obsidian', 242, 'PSA 10'),
(1, 2019, 'Mewtwo & Mew GX #SM191', 138, 'PSA 10'),
(1, 2021, 'Vaporeon V #75', 115, 'Grading in process'),
(2, 2023, 'Pikachu with Grey Felt', 115, 'Ungraded'),
(2, 2023, 'MewTwo VSTAR #GG44', 105, 'PSA 10'),
(2, 2014, 'Dialga EX #122', 102, 'Grading in process'),
(3, 2022, 'Charizard VSTAR #SWSH262', 95, 'PSA 10'),
(4, 2023, 'Iono Holo #269', 85, 'Grading in process'),
(5, 2023, 'Charizard EX #223', 84, 'PSA 8'),
(6, 2023, 'Pikachu #160', 55, 'PSA 10'),
(6, 2023, 'MewTwo VSTAR #GG44', 51, 'Ungraded'),
(7, 2023, 'Raikou V #GG41', 47, 'Ungraded'),
(7, 2021, 'Pikachu VMAX #279', 47, 'Grading in process'),
(8, 2021, 'Rapid Strike Urshifu', 46, 'Grading in process'),
(8, 2023, 'Venusaur EX #198', 40, 'Grading in process'),
(9, 2016, 'Charizard #11', 38, 'Grading in process'),
(9, 2023, 'Erikas Invitation #203', 38, 'Grading in process');

-- DROP TABLE trainer IF EXISTS;
-- DROP TABLE cards IF EXISTS;

-- CREATE TABLE "trainer"(
--     "id" SERIAL NOT NULL,
--     "first_name" TEXT NOT NULL,
--     "last_name" TEXT NOT NULL,
--     "email" TEXT NOT NULL
-- );

-- CREATE TABLE "cards"(
--     "trainer_id" INTEGER NOT NULL,
--     "year" INTEGER NOT NULL,
--     "name" TEXT NOT NULL,
--     "value" INTEGER NOT NULL,
--     "grade" TEXT NOT NULL
-- );
-- ALTER TABLE
--     "cards" ADD PRIMARY KEY("trainer_id");
-- ALTER TABLE
--     "trainer" ADD PRIMARY KEY("id");
-- ALTER TABLE
--     "trainer" ADD CONSTRAINT "trainer_id_foreign" FOREIGN KEY("id") REFERENCES "cards"("trainer_id");

-- INSERT INTO trainer (first_name, last_name, email) VALUES ('John', 'Gordinier', 'jsgordinier@gmail.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Jacob', 'Jingleheimer-Schmidt', 'jschmidt@gmail.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Inigo', 'Montoya', 'princessBride@yahoo.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Bruce', 'Banner', 'rageAndSmash@allgreen.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Peter', 'Parker', 'whyDoAllSuperheroesUseSameLetter@yahoo.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Thor', 'SonOfOdin', 'GodOfThunder@asgard.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Ryan', 'Reynolds', 'chimichangas@aol.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Tony', 'Stark', 'thatEgoOfMine@starkenterprise.com');
-- INSERT INTO trainer (first_name, last_name, email) VALUES ('Walter', 'White', 'losPollos@Hermanos.com');

-- INSERT INTO cards (year, name, value, grade) VALUES (1, 2023, 'Charizard EX #228 Obsidian', 242, 'PSA 10');
-- INSERT INTO cards (year, name, value, grade) VALUES (2019, 'Mewtwo & Mew GX #SM191', 138, 'PSA 10');
-- INSERT INTO cards (year, name, value, grade) VALUES (2021, 'Vaporeon V #75', 115, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Pikachu with Grey Felt', 115, 'Ungraded');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'MewTwo VSTAR #GG44', 105, 'PSA 10');
-- INSERT INTO cards (year, name, value, grade) VALUES (2014, 'Dialga EX #122', 102, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2022, 'Charizard VSTAR #SWSH262', 95, 'PSA 10');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Iono Holo #269', 85, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Charizard EX #223', 84, 'PSA 8');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Pikachu #160', 55, 'PSA 10');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'MewTwo VSTAR #GG44', 51, 'Ungraded');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Raikou V #GG41', 47, 'Ungraded');
-- INSERT INTO cards (year, name, value, grade) VALUES (2021, 'Pikachu VMAX #279', 47, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2021, 'Rapid Strike Urshifu', 46, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Venusaur EX #198', 40, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2016, 'Charizard #11', 38, 'Grading in process');
-- INSERT INTO cards (year, name, value, grade) VALUES (2023, 'Erikas Invitation #203', 38, 'Grading in process');

