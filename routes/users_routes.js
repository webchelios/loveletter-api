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
userRoutes.get("/find/:userId", getUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/user/:id", getUserById);
userRoutes.put("/user/:id", updateUser);

export { userRoutes };
