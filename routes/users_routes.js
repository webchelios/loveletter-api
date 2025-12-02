import express from "express";
import {
	getUsers,
	registerUser,
	loginUser,
	updateUser,
	getUserById,
	deactivateUser,
} from "../controllers/users_controller.js";
import { verifyToken } from "../middlewares/auth.js";
const userRoutes = express.Router();

userRoutes.get(
	"/",
	//verifyToken,
	getUsers,
);

userRoutes.get("/:id", getUserById);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.put("/:id", updateUser);
userRoutes.delete(
	"/:id",
	verifyToken,
	(req, res) => {
		const id = req.params.id;
		const result = deactivateUser(id);
		result
			.then((user) => {
				res.status(201).json(user);
			})
			.catch((error) => {
				res.status(400).json(error);
			});
	},
);

export { userRoutes };
