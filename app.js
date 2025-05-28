import express from "express";
import mongoose from "mongoose";
import { userRoutes, directorsroutes, moviesroutes } from "./routes/index.js";
import "dotenv/config";
import cors from "cors";

mongoose
	.connect("mongodb://127.0.0.1:27017/movies", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Conectado a MongoDB...");
	})
	.catch((err) => console.log("No se pudo conectar con MongoDB..", err));

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Movies database");
});
app.use("/users", userRoutes);
app.use("/directors", directorsroutes);
app.use("/movies", moviesroutes);

const port = process.env.PORT || 3002;
app.listen(port, () => {});
