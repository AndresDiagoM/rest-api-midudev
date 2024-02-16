const zod = require("zod");

const movieSchema = zod.object({
	title: zod.string({
		invalid_type_error: "Title must be a string",
		required_error: "Title is required",
	}),
	director: zod.string(),
	genre: zod.array(
		zod.enum(["Action", "Comedy", "Drama", "Horror", "Romance", "Thriller", "Adventure", "Fantasy"]),
		{
			invalid_type_error: "Genre must be an array of strings",
			required_error: "Genre is required",
		}
	),
	year: zod.number().int().positive().min(1900).max(2024),
	duration: zod.number().int().positive(),
	rate: zod.number().min(0).max(10).default(5),
	poster: zod.string().url({
		message: "Poster must be a valid URL",
	}),
});

function validateMovie(movie) {
	return movieSchema.safeParse(movie); // returns a tuple [result, error],
	// help us to handle errors, and avoid using try/catch
}

function validateUpdateMovie(movie) {
	return movieSchema.partial().safeParse(movie);
}

module.exports = {
	validateMovie,
	validateUpdateMovie, 
};
