// Entry Point for our Backend
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("API running"));

app.use(notFound); // override the default not found
app.use(errorHandler); // override the default error handler

app.listen(port, () =>
  console.log(`Server started on port http://localhost:${port}`)
);