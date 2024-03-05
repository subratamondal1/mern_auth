// Entry Point for our Backend
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => res.send("API running"));

app.listen(port, () =>
  console.log(`Server started on port http://localhost:${port}`)
);


