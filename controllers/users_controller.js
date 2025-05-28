import Users from "../models/users_model.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
	try {
		const usuarios = await Users.find();
		res.json(usuarios);
	} catch (error) {
		res.status(400).json({
			error,
		});
	}
};

const getUser = async (req, res) => {
	try {
		const usuario = await Users.find({ _id: req.params.userId });
		res.json(usuario);
	} catch (error) {
		res.status(400).json({
			error,
		});
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
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

const loginUser = async (req, res) => {
	Users.findOne({ email: req.body.email })
		.then((datos) => {
			if (datos) {
				const passwordValido = bcrypt.compareSync(
					req.body.password,
					datos.password,
				);
				if (!passwordValido)
					return res
						.status(400)
						.json({ error: "ok", msj: "Usuario o contraseña incorrecta." });
				const jwToken = jwt.sign(
					{
						usuario: {
							_id: datos._id,
							name: datos.name,
							username: datos.username,
							email: datos.email,
						},
					},
					process.env.SEED,
					{ expiresIn: process.env.EXPIRATION },
				);
				res.json({
					usuario: {
						_id: datos._id,
						name: datos.name,
						username: datos.username,
						email: datos.email,
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
				msj: `Error en el servicio${err}`,
			});
		});
};

const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await Users.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updateUser = async (req, res) => {
	const { id } = req.params; // Obtener el ID de la película de los parámetros de la solicitud
	const { name, username } = req.body; // Obtener los nuevos datos de la película del cuerpo de la solicitud

	try {
		// Verificar si la película existe
		const user = await Users.findById(id);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		// Actualizar los campos de la película
		user.name = name;
		user.username = username;

		// Guardar los cambios en la base de datos
		await user.save();

		// Responder con la película actualizada
		res.status(200).json(user);
	} catch (error) {
		// Manejar errores de servidor
		console.error(error);
		res.status(500).json({ message: "Error al actualizar la película" });
	}
};

export { getUsers, getUser, registerUser, loginUser, getUserById, updateUser };
