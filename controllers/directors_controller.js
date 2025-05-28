import Directors from "../models/directors_model.js";

export const getAllDirectors = async (req, res) => {
	try {
		const directors = await Directors.find();
		res.json(directors);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createDirector = async (req, res) => {
	console.log(req.body);
	const director = new Directors({
		surname: req.body.surname,
		age: req.body.age,
	});

	try {
		const newDirector = await director.save();
		res.status(201).json(newDirector);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const searchDirectors = async (req, res) => {
	const { surname } = req.query;
	try {
		const directors = await Directors.find({
			surname: { $regex: surname, $options: "i" },
			status: true,
		});
		res.json(directors);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ message: "Error al buscar directores por apellido" });
	}
};

export const getDirectorById = async (req, res) => {
	const { id } = req.params;
	try {
		const director = await Directors.findById(id);
		if (!director) {
			return res.status(404).json({ message: "Director not found" });
		}
		res.json(director);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export async function deactivateDirector(id) {
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
}

export const updateDirector = async (req, res) => {
	const { id } = req.params;
	const { surname, age } = req.body;

	try {
		const updatedDirector = await Directors.findByIdAndUpdate(
			id,
			{ surname, age },
			{ new: true },
		);

		if (!updatedDirector) {
			return res.status(404).json({ message: "Director not found" });
		}

		res.status(200).json(updatedDirector);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
