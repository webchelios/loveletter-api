import express from "express";
import {
	getAllMovies,
	createMovie,
	searchMovies,
	getMoviesByDirector,
	getMovieById,
	deactivateMovie,
	updateMovie,
} from "../controllers/movies_controller.js";
import { verifyToken } from "../middlewares/auth.js";

const moviesroutes = express.Router();

moviesroutes.get("/", getAllMovies);
moviesroutes.post("/", createMovie);
moviesroutes.get("/search", searchMovies);
moviesroutes.get("/by-director", getMoviesByDirector);
moviesroutes.get("/movie/:id", getMovieById);
moviesroutes.put("/movie/:id", updateMovie);
moviesroutes.delete(
	"/:id",
	// verifyToken,
	(req, res) => {
		const body = req.body;
		const result = deactivateMovie(req.params.id, body);
		result
			.then((director) => {
				res.status(201).json(director);
			})
			.catch((error) => {
				res.status(400).json(error);
			});
	},
);

export { moviesroutes };
