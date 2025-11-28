import express from "express";
import {
	getUsers,
	getUser,
	registerUser,
	loginUser,
	updateUser,
	getUserById,
} from "../controllers/users_controller.js";
import { verifyToken } from "../middlewares/auth.js";
const userRoutes = express.Router();

userRoutes.get(
	"/",
	//verifyToken,
	getUsers,
);

userRoutes.get("/user/:id", getUserById);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.put("/user/:id", updateUser);
userRoutes.delete(
	"/:id",
	// verifyToken,
	(req, res) => {
		const body = req.body;
		const result = deactivateUser(req.params.id, body);
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
