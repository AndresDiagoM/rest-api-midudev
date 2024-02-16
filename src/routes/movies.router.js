const router = require('express').Router();
const crypto = require("crypto");

const { validateMovie, validateUpdateMovie } = require('../schemas');

const movies = require('../utils/movies.json');

// normal methods: GET/HEAD/POST
// complex methods: PUT/DELETE/PATCH - CORS PRE-FLIGHT, OPTIONS
const ACCEPTED_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://myapp.com",
	"http://localhost:5500",
	"http://127.0.0.1:5500",
];

router.get("/", (req, res) => {
	const origin = req.get("origin");
	if (ACCEPTED_ORIGINS.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin);
	}

	const { title, genre } = req.query;
	if (title) {
		const filteredMovies = movies.filter((movie) =>
			movie.title.toLowerCase().includes(title.toLowerCase())
		);
		return res.json(filteredMovies);
	} else if (genre) {
		const filteredMovies = movies.filter((movie) =>
			movie.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
		);
		return res.json(filteredMovies);
	}
	res.json(movies);
});

router.get("/:id", (req, res) => {
	// path-to-regex -> /movies/:id -> /movies/1, facilita manejo de expresiones regulares
	const { id } = req.params;
	const movie = movies.find((movie) => movie.id == id);
	if (movie) {
		res.json(movie);
	} else {
		res.status(404).send("Movie not found");
	}
});

router.post("/", (req, res) => {
	const result = validateMovie(req.body);
	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	const newMovie = {
		id: crypto.randomUUID(),
		...result,
	}
	// this is not rest because we are saving the state of the server
	movies.push(newMovie);
	res.status(201).json(newMovie);
});

router.patch("/:id", (req, res) => {
	const { id } = req.params;
	const movieIndex = movies.findIndex((movie) => movie.id == id);
	if (movieIndex === -1) {
		return res.status(404).send("Movie not found");
	}
	const result = validateUpdateMovie(req.body);
	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	movies[movieIndex] = {
		...movies[movieIndex],
		...result.data,
	};
	res.json(movies[movieIndex]);
});

router.delete("/:id", (req, res) => {
	res.set("Access-Control-Allow-Origin", "*");
	const { id } = req.params;
	const movieIndex = movies.findIndex((movie) => movie.id == id);
	if (movieIndex === -1) {
		return res.status(404).send("Movie not found");
	}
	movies.splice(movieIndex, 1);
	res.status(204).send();
});

router.options("/:id", (req, res) => {
	const origin = req.get("origin");
	if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
	}
	res.sendStatus(200);
});

module.exports = router;