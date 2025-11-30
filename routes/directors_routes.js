import express from "express";
import {
	getAllDirectors,
	createDirector,
	searchDirectorsBySurname,
	getDirectorById,
	deactivateDirector,
	updateDirector,
} from "../controllers/directors_controller.js";
import { verifyToken } from "../middlewares/auth.js";

const directorsroutes = express.Router();

directorsroutes.get("/", getAllDirectors);
directorsroutes.get("/search", searchDirectorsBySurname);
directorsroutes.get("/:id", getDirectorById);
directorsroutes.post("/", createDirector);
directorsroutes.put("/:id", updateDirector);
directorsroutes.delete("/:id",
	verifyToken,
	(req, res) => {
		const body = req.body;
		const result = deactivateDirector(req.params.id, body);
		result
			.then((director) => {
				res.status(200).json(director);
			})
			.catch((error) => {
				res.status(400).json({ message: `Error al eliminar un director, introduzca un id válido` })
			});
	});

export { directorsroutes };
