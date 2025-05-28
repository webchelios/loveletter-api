import Movies from "../models/movies_model.js";

export const getAllMovies = async (req, res) => {
	try {
		const movies = await Movies.find();
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createMovie = async (req, res) => {
	console.log(req.body);
	const movie = new Movies({
		title: req.body.title,
		synopsis: req.body.synopsis,
		year: req.body.year,
		director: req.body.director,
	});

	try {
		const newMovie = await movie.save();
		res.status(201).json(newMovie);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const searchMovies = async (req, res) => {
	const { title } = req.query;
	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}
	try {
		const movies = await Movies.find({
			title: { $regex: title, $options: "i" },
		});
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getMoviesByDirector = async (req, res) => {
	const { directorSurname } = req.query;
	try {
		const movies = await Movies.find({ director: directorSurname });
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getMovieById = async (req, res) => {
	const { id } = req.params;
	try {
		const movie = await Movies.findById(id);
		if (!movie) {
			return res.status(404).json({ message: "Movie not found" });
		}
		res.json(movie);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export async function deactivateMovie(id) {
	const deactivatedMovie = await Movies.findByIdAndUpdate(
		id,
		{
			$set: {
				status: false,
			},
		},
		{ new: true },
	);
	return deactivatedMovie;
}

export const updateMovie = async (req, res) => {
	const { id } = req.params; // Obtener el ID de la película de los parámetros de la solicitud
	const { title, synopsis, year } = req.body; // Obtener los nuevos datos de la película del cuerpo de la solicitud

	try {
		// Verificar si la película existe
		const movie = await Movies.findById(id);
		if (!movie) {
			return res.status(404).json({ message: "Película no encontrada" });
		}

		// Actualizar los campos de la película
		movie.title = title;
		movie.synopsis = synopsis;
		movie.year = year;

		// Guardar los cambios en la base de datos
		await movie.save();

		// Responder con la película actualizada
		res.status(200).json(movie);
	} catch (error) {
		// Manejar errores de servidor
		console.error(error);
		res.status(500).json({ message: "Error al actualizar la película" });
	}
};
