import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import catchAsync from "./utils/catchAsync.js";
import ApiError from "./utils/apiError.js";
import errorHandler from "./middlewares/error.js";
import httpStatus from "http-status";
import { query, validationResult } from "express-validator";

// Vaidation rules
const searchValidationRules = [
  query("q")
    .trim() // Remove leading and trailing whitespace
    .isString()
    .withMessage("Query parameter must be a string")
    .isLength({ min: 1 })
    .withMessage("Query parameter must be at least 1 character long"),
];
const headlinesValidationRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];

let serverUrl = "";

let jsonPathURLS = {
  search: "/search",
  pagination: "/pagination",
  headlines: "/headlines",
};

let gnewsPathURLS = {
  search: `/search`,
  pagination: `/top-headlines?category=technology&lang=en&country=in&max=10`,
};

let finalPathURLS = {};
console.log(`Running in ${process.env.NODE_ENV} mode`);

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which .env file to load based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Load the specific .env file
dotenv.config({ path: path.resolve(__dirname, envFile) });

if (process.env.NODE_ENV === "development") {
  // URL for json-server
  serverUrl = process.env.JSON_SERVER_URL || "http://localhost:5000";
  finalPathURLS = jsonPathURLS;
} else if (process.env.NODE_ENV === "production") {
  // URL for production
  serverUrl = process.env.GNEWS_BACKEND_BASE_URL;
  finalPathURLS = gnewsPathURLS;
}
const port = process.env.BACKEND_PORT || 4000;

const app = express();

app.use(express.json());

// through cors, we have mentioned only to process req from this frontend URL
// our frontend URL - origin is fixed
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.get(
  "/api/headlines",
  headlinesValidationRules, // Apply the validation rules
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page);
    const limit = 10; // Fixed limit of 10 items per page
    let headlineURL = "";

    if (
      process.env.NODE_ENV === "production" &&
      finalPathURLS === gnewsPathURLS &&
      page
    ) {
      console.log("Pagination not supported for this resource");
      return res.status(httpStatus.NOT_IMPLEMENTED).json({
        status: httpStatus.NOT_IMPLEMENTED,
        message: "Pagination not supported for this resource",
      });
    } else if (process.env.NODE_ENV === "production") {
      headlineURL = `${serverUrl}${finalPathURLS.pagination}&apikey=${process.env.GNEWS_API_KEY}`;
    } else {
      headlineURL = `${serverUrl}${finalPathURLS.pagination}`;
    }
    console.log(`Headline URL: ${headlineURL}`);

    const response = await fetch(headlineURL);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const allData = await response.json();

    if (!page) {
      return res.json({
        totalNews: allData.articles.length,
        totalPages: Math.ceil(allData.articles.length / limit),
        data: allData.articles.slice(0, limit),
      });
    }

    const startIndex = (page - 1) * limit;

    if (startIndex >= allData.articles.length) {
      return res.status(404).json({ message: "Page not found" });
    }

    const endIndex = startIndex + limit;

    const paginatedData = allData.articles.slice(startIndex, endIndex);

    res.json({
      totalNews: allData.articles.length,
      currPage: page,
      totalPages: Math.ceil(allData.articles.length / limit),
      data: paginatedData,
    });
  })
);

app.get(
  "/api/search",
  searchValidationRules, // Apply the validation rules
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(403).json({ message: errors.array() });
    }

    const query = req.query.q;
    const encodedQuery = encodeURIComponent(query);
    let searchURL = "";
    if (finalPathURLS === gnewsPathURLS) {
      searchURL = `${serverUrl}${finalPathURLS.search}?q=${encodedQuery}&lang=en&country=in&max=10&apikey=${process.env.GNEWS_API_KEY}`;
    } else {
      searchURL = `${serverUrl}${finalPathURLS.search}?q=${encodedQuery}`;
    }
    console.log(`Search URL: ${searchURL}`);
    const response = await fetch(searchURL);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    const { articles, ...rest } = await response.json();
    res.json({
      data: articles,
      ...rest,
      totalPages: Math.ceil(articles.length / 10),
    });
  })
);

app.use(errorHandler);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  //   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  res.status(httpStatus.NOT_FOUND).json({
    status: httpStatus.NOT_FOUND,
    message: "Page Not Found",
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
