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

app.use(express.static("public"));

app.get("/cards", (req, res) => {
  client.query("SELECT * FROM cards;").then((result) => {
    res.send(result.rows);
  });
});

app.get("/cards/:trainerId", (req, res) => {
  const trainerId = parseInt(req.params.trainerId);

  if (isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
    return res.status(400).json({ error: "Invalid Trainer ID" });
  }

  // Query the database for cards associated with the specified trainer
  const query = "SELECT * FROM cards WHERE trainer_id = $1";
  client
    .query(query, [trainerId])
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error("Error querying database for cards:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(PORT || 3030, () => {
  console.log(`Listening on port ${PORT || 3030}`);
});
