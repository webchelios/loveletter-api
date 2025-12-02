import Users from "../models/users_model.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
	try {
		const usuarios = await Users.find();
		res.json(usuarios);
	} catch (err) {
		res.status(400).json({ message: `Error al obtener todos los usuarios: ${err.message}` });
	}
};


const registerUser = async (req, res) => {
	try {
		const body = req.body;

		const usuario = new Users({
			email: body.email,
			name: body.name,
			username: body.username,
			password: bcrypt.hashSync(body.password, 10),
		});
		const savedUser = await usuario.save();

		res.json({
			user: savedUser,
		});
	} catch (err) {
		res.status(400).json({ message: `Error al registrar usuario: ${err.message}` });
	}
};

const loginUser = async (req, res) => {
	Users.findOne({ email: req.body.email })
		.then((data) => {
			if (data) {
				const validPassword = bcrypt.compareSync(
					req.body.password,
					data.password,
				);
				if (!validPassword)
					return res
						.status(400)
						.json({ error: "ok", msj: "Usuario o contraseña incorrecta." });
				const jwToken = jwt.sign(
					{
						user: {
							_id: data._id,
							name: data.name,
							username: data.username,
							email: data.email,
							image: data.image,
							role: data.role,
						},
					},
					process.env.SEED,
					{ expiresIn: process.env.EXPIRATION },
				);
				res.json({
					user: {
						_id: data._id,
						name: data.name,
						username: data.username,
						email: data.email,
						image: data.image,
						role: data.role,
					},
					jwToken,
				});
			} else {
				res.status(400).json({
					error: "ok",
					msj: "Usuario o contraseña incorrecta.",
				});
			}
		})
		.catch((err) => {
			res.status(400).json({
				error: "ok",
				msj: `Error en el servicio ${err}`,
			});
		});
};

const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await Users.findById(id);
		if (!user) {
			return res.status(404).json({ message: `Usuario con el id ${id} no encontrado` });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updateUser = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: "El 'id' es requerido" });
	}
	const { name, username, image } = req.body;

	try {

		const user = await Users.findById(id);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		user.name = name || user.name;
		user.username = username || user.username;
		user.image = image || user.image;

		await user.save();

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: `Error al actualizar la película ${err.message}` });
	}
};

export const deactivateUser = async () => {
	try {
		const deactivatedUser = await Users.findByIdAndUpdate(
			id,
			{
				$set: {
					status: false,
				},
			},
			{ new: true },
		);
		return deactivatedUser;
	} catch (err) {
		throw new Error(err)
	}
}

export { getUsers, registerUser, loginUser, getUserById, updateUser };
