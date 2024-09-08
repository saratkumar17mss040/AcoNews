import express from "express";
import cors from "cors";
import "dotenv/config";
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

// URL for json-server
const jsonServerUrl = process.env.JSON_SERVER_URL || "http://localhost:5000";
const port = process.env.PORT || 4000;

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

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Fixed limit of 10 items per page

    const response = await fetch(`${jsonServerUrl}/pagination`);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const allData = await response.json();

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
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(403).json({ message: errors.array() });
    }

    const query = req.query.q;
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${jsonServerUrl}/search?q=${encodedQuery}`;
    const response = await fetch(searchUrl);

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
