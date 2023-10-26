import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PORT, DATABASE_URL } = process.env;

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

try {
  await client.connect();
} catch (error) {
  console.error("Error connecting to the database", error);
}

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/cards", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM cards;");
    res.send(result.rows);
  } catch (error) {
    console.error("Error querying database for cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cards/:trainerId", async (req, res) => {
  try {
    const trainerId = parseInt(req.params.trainerId);

    if (isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
      return res.status(400).json({ error: "Invalid Trainer ID" });
    }

    const query = "SELECT * FROM cards WHERE trainer_id = $1";
    const result = await client.query(query, [trainerId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error querying database for cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE A TRADE PROPOSAL
app.post("/trade", async (req, res) => {
  console.log("hit");
  try {
    const {
      proposing_trainer_id,
      accepting_trainer_id,
      proposed_card_id,
      accepted_card_id,
    } = req.body;

    console.log("post try");

    // Validate input data (you might want to add more validation logic)
    if (
      !proposing_trainer_id ||
      !accepting_trainer_id ||
      !proposed_card_id ||
      !accepted_card_id
    ) {
      return res.status(400).json({ error: "Invalid trade proposal data" });
    }

    // Check if the cards and trainers involved in the proposal exist
    const cardsQuery = "SELECT * FROM cards WHERE id IN ($1, $2)";
    const trainersQuery = "SELECT * FROM trainer WHERE id IN ($1, $2)";

    const proposedCardPromise = client.query(cardsQuery, [
      proposed_card_id,
      accepted_card_id,
    ]);
    const trainersPromise = client.query(trainersQuery, [
      proposing_trainer_id,
      accepting_trainer_id,
    ]);

    const proposedCard = await proposedCardPromise;
    const acceptedCard = await trainersPromise;
    const proposingTrainer = await trainersPromise;
    const acceptingTrainer = await trainersPromise;

    console.log("promise made");
    console.log("proposed card:", proposedCard.rows);
    console.log("accepted card:", acceptedCard.rows);
    console.log("proposing trainer:", proposingTrainer.rows);
    console.log("accepting trainer:", acceptingTrainer.rows);
    if (
      proposedCard.rows.length !== 2 ||
      acceptedCard.rows.length !== 2 ||
      proposingTrainer.rows.length !== 2 ||
      acceptingTrainer.rows.length !== 2
    ) {
      return res
        .status(400)
        .json({ error: "Invalid cards or trainers in the trade proposal" });
    }

    // ADD THE TRADE PROPOSAL TO THE DATABASE
    const insertQuery = ` INSERT INTO trade_proposals (proposing_trainer_id, accepting_trainer_id, proposed_card_id, accepted_card_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    console.log(insertQuery);

    const values = [
      proposing_trainer_id,
      accepting_trainer_id,
      proposed_card_id,
      accepted_card_id,
      "pending",
    ];
    console.log(values);

    const result = await client.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating trade proposal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET TRADE PROPOSALS FOR A TRAINER
app.get("/trade/:trainerId", async (req, res) => {
  try {
    const trainerId = parseInt(req.params.trainerId);
    if (isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
      return res.status(400).json({ error: "Invalid Trainer ID" });
    }
    const query = `SELECT * FROM trade_proposals WHERE proposing_trainer_id = $1 OR accepting_trainer_id = $1;`;

    const result = await client.query(query, [trainerId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching trade proposals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// RESPONDING TO A TRADE PROPOSAL
app.post("/trade/respond/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    // Validate input data
    if (!id || (response !== "Y" && response !== "N")) {
      return res.status(400).json({ error: "Invalid response data" });
    }
    console.log("step1");

    // Fetch the trade proposal from the database
    const proposalQuery =
      "SELECT * FROM trade_proposals WHERE proposal_id = $1";
    const proposalResult = await client.query(proposalQuery, [id]);
    if (proposalResult.rows.length !== 1) {
      return res.status(400).json({ error: "Invalid trade proposal ID" });
    }

    const tradeProposal = proposalResult.rows[0];
    console.log("step2");
    // Handle the response
    if (response === "Y") {
      // Accept the trade: Update the cards' trainer_id in the database
      const updateCardsQuery = `
        UPDATE cards
        SET trainer_id = $1
        WHERE id IN ($2, $3);
      `;

      const updateValues = [
        tradeProposal.proposing_trainer_id,
        tradeProposal.proposed_card_id,
        tradeProposal.accepted_card_id,
      ];

      await client.query(updateCardsQuery, updateValues);
    }
    console.log("step3");
    // Remove the trade proposal from the database
    const deleteQuery = "DELETE FROM trade_proposals WHERE proposal_id = $1";
    await client.query(deleteQuery, [id]);
    res.status(200).json({ message: "Trade response processed successfully" });
  } catch (error) {
    console.error("Error responding to trade proposal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT || 3030, () => {
  console.log(`Listening on port ${PORT || 3030}`);
});
