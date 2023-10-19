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

app.listen(3030, () => {
  console.log("listening on port 3030");
});
