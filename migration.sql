DROP TRIGGER IF EXISTS update_trade_proposal_timestamp;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS trainer CASCADE;
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
(1, 2021, 'Vaporeon V #75', 115, 'Grade coming!'),
(2, 2023, 'Pikachu with Grey Felt', 115, 'Ungraded'),
(2, 2023, 'MewTwo VSTAR #GG44', 105, 'PSA 10'),
(2, 2014, 'Dialga EX #122', 102, 'Grade coming!'),
(3, 2022, 'Charizard VSTAR #SWSH262', 95, 'PSA 10'),
(4, 2023, 'Iono Holo #269', 85, 'Grade coming!'),
(5, 2023, 'Charizard EX #223', 84, 'PSA 8'),
(6, 2023, 'Pikachu #160', 55, 'PSA 10'),
(6, 2023, 'MewTwo VSTAR #GG44', 51, 'Ungraded'),
(7, 2023, 'Raikou V #GG41', 47, 'Ungraded'),
(7, 2021, 'Pikachu VMAX #279', 47, 'Grade coming!'),
(8, 2021, 'Rapid Strike Urshifu', 46, 'Grade coming!'),
(8, 2023, 'Venusaur EX #198', 40, 'Grade coming!'),
(9, 2016, 'Charizard #11', 38, 'Grade coming!'),
(9, 2023, 'Erikas Invitation #203', 38, 'Grade coming!');

CREATE TABLE trade_proposals (
  proposal_id SERIAL PRIMARY KEY,
  proposing_trainer_id INTEGER NOT NULL,
  accepting_trainer_id INTEGER NOT NULL,
  proposed_card_id INTEGER NOT NULL,
  accepted_card_id INTEGER NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (proposing_trainer_id) REFERENCES trainer(id),
  FOREIGN KEY (accepting_trainer_id) REFERENCES trainer(id),
  FOREIGN KEY (proposed_card_id) REFERENCES cards(id),
  FOREIGN KEY (accepted_card_id) REFERENCES cards(id)
);

CREATE INDEX idx_proposing_trainer_status ON trade_proposals (proposing_trainer_id, status);

CREATE OR REPLACE FUNCTION update_trade_proposal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_trade_proposal_timestamp
BEFORE UPDATE ON trade_proposals
FOR EACH ROW EXECUTE FUNCTION update_trade_proposal_timestamp();