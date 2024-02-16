const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3000;

// middlewares
app.disable("x-powered-by");
app.use(express.json());
app.use(cors({
	origin: (origin, cb) => {
		const ACCEPTED_ORIGINS = [
			"http://localhost:3000",
			"http://localhost:3001",
			"https://myapp.com",
			"http://127.0.0.1:5500",
			"http://localhost:5500",
		];
		if (ACCEPTED_ORIGINS.includes(origin)) {
			return cb(null, true);
		} else if(!origin){
			return cb(null, true);
		} else {
			return cb(new Error("Not allowed by CORS"));
		}
	}
}));


// routes
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.use("/", require("./src/routes"));

// errors middleware
app.use((req, res, next) => {
	res.status(404).send("<h1>404 Not Found</h1>");
	next();
});

app.listen(3000, () => {
	console.log(`Server is running on port ${PORT}`);
});
