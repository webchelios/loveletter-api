import express from "express";
import {
	getAllDirectors,
	createDirector,
	searchDirectors,
	getDirectorById,
	deactivateDirector,
	updateDirector,
} from "../controllers/directors_controller.js";
import { verificarToken } from "../middlewares/auth.js";

const directorsroutes = express.Router();

directorsroutes.get("/", getAllDirectors);
directorsroutes.get("/:id", getDirectorById);
directorsroutes.post("/", createDirector);
directorsroutes.get("/search", searchDirectors);
directorsroutes.put("/:id", updateDirector);
directorsroutes.delete("/:id", verificarToken, (req, res) => {
	const body = req.body;
	const result = deactivateDirector(req.params.id, body);
	result
		.then((director) => {
			res.status(201).json(director);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

export { directorsroutes };
