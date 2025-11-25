import Movies from "../models/movies_model.js";

export const getAllMovies = async (req, res) => {
	try {
		const movies = await Movies.find();
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: `Error al obtener todas las películas: ${err.message}` });
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
		res.status(400).json({ message: `Error al crear una pelicula: ${err.message}` });
	}
};

export const searchMovies = async (req, res) => {
	const { title } = req.query;
	if (!title) {
		return res.status(400).json({ message: "El 'title' es requerido" });
	}
	try {
		const movies = await Movies.find({
			title: { $regex: title, $options: "i" },
		});
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: `Error al buscar películas: ${err.message}` });
	}
};

export const getMoviesByDirector = async (req, res) => {
	const { directorSurname } = req.query;
	try {
		const movies = await Movies.find({ director: directorSurname });
		res.json(movies);
	} catch (err) {
		res.status(500).json({ message: `Error al buscar películas por su director: ${err.message}` });
	}
};

export const getMovieById = async (req, res) => {
	const { id } = req.params;
	try {
		const movie = await Movies.findById(id);
		if (!movie) {
			return res.status(404).json({ message: "Película no encontrada" });
		}
		res.json(movie);
	} catch (err) {
		res.status(500).json({ message: `Error al encontrar una película por su id: ${err.message}` });
	}
};

export async function deactivateMovie(id) {
	try {
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
	} catch (err) {
		return false
	}
}

export const updateMovie = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: "El 'id' es requerido" });
	}
	const { title, synopsis, year } = req.body;

	try {
		const movie = await Movies.findById(id);
		if (!movie) {
			return res.status(404).json({ message: "Película no encontrada" });
		}

		movie.title = title;
		movie.synopsis = synopsis;
		movie.year = year;

		await movie.save();

		res.status(200).json(movie);
	} catch (err) {

		res.status(500).json({ message: `Error al actualizar la película ${err.message}` });
	}
};
