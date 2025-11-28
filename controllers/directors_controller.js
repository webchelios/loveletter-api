import Directors from "../models/directors_model.js";

export const getAllDirectors = async (req, res) => {
	try {
		const directors = await Directors.find();
		res.json(directors);
	} catch (err) {
		res.status(500).json({ message: `Error al obtener los directores: ${err.message}` });
	}
};

export const createDirector = async (req, res) => {
	const director = new Directors({
		name: req.body.name,
		surname: req.body.surname,
		age: req.body.age,
	});

	try {
		const newDirector = await director.save();
		res.status(201).json(newDirector);
	} catch (err) {
		res.status(400).json({ message: `Error al crear un director: ${err.message}` });
	}
};

export const searchDirectorsBySurname = async (req, res) => {
	const { surname } = req.query;
	if (!surname) {
		return res.status(400).json({ message: "El 'surname' es requerido" });
	}

	try {
		const directors = await Directors.find({
			surname: { $regex: surname, $options: "i" },
			status: true,
		});
		res.json(directors);
	} catch (err) {
		res.status(500).json({ message: `Error al buscar directores: ${err.message}` });
	}
};

export const getDirectorById = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: "El 'id' es requerido" });
	}

	try {
		const director = await Directors.findById(id);
		if (!director) {
			return res.status(404).json({ message: "Director not found" });
		}
		res.json(director);
	} catch (err) {
		res.status(500).json({ message: `Error al obtener un director por su ID: ${err.message}` });
	}
};

export const deactivateDirector = async (id) => {
	try {
		const deactivatedDirector = await Directors.findByIdAndUpdate(
			id,
			{
				$set: {
					status: false,
				},
			},
			{ new: true },
		);
		return deactivatedDirector;
	} catch (err) {
		throw new Error(err)
	}
}

export const updateDirector = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: "El 'id' es requerido" });
	}
	const { surname, age } = req.body;

	try {
		const director = await Directors.findById(id);
		if (!director) {
			return res.status(404).json({ message: "Película no encontrada" });
		}

		director.surname = surname || director.surname;
		director.age = age || director.age;

		await director.save();

		res.status(200).json(director);
	} catch (err) {
		res.status(500).json({ message: `Error al actualizar un director: ${err.message}` });
	}
};
