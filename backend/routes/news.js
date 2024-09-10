import express from "express";
import {
  headlinesValidationRules,
  searchValidationRules,
} from "../validations/newsValidations.js";
import catchAsync from "../utils/catchAsync.js";
import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

const router = express.Router();

const jsonPathURLS = {
  search: "/search",
  pagination: "/pagination",
  headlines: "/headlines",
};

const gnewsPathURLS = {
  search: `/search`,
  pagination: `/top-headlines?category=technology&lang=en&country=in&max=10`,
};

let finalPathURLS =
  process.env.NODE_ENV === "development" ? jsonPathURLS : gnewsPathURLS;
let serverUrl =
  process.env.NODE_ENV === "development"
    ? process.env.JSON_SERVER_URL
    : process.env.GNEWS_BACKEND_BASE_URL;

console.log("Server base URL: ", serverUrl);

router.get(
  "/headlines",
  headlinesValidationRules,
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 422 Unprocessable Entity
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        status: httpStatus.UNPROCESSABLE_ENTITY,
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    let headlineURL = `${serverUrl}${finalPathURLS.pagination}`;

    if (process.env.NODE_ENV === "production") {
      headlineURL += `&apikey=${process.env.GNEWS_API_KEY}`;
    }

    const response = await fetch(headlineURL);
    if (!response.ok) {
      // 500 Internal Server Error
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to fetch headlines: ${response.statusText}`
      );
    }

    const allData = await response.json();
    const paginatedData = paginate(allData.articles, page, limit);

    const totalPages = Math.ceil(allData.articles.length / limit);

    if (page > totalPages) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Page not available",
      });
    }

    // 200 OK
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      totalNews: allData.articles.length,
      currPage: page || 1,
      totalPages: Math.ceil(allData.articles.length / limit),
      data: paginatedData,
    });
  })
);

router.get(
  "/search",
  searchValidationRules,
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 422 Unprocessable Entity
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        status: httpStatus.UNPROCESSABLE_ENTITY,
        message: errors.array(),
      });
    }

    const query = req.query.q;
    const lang = req.query.lang;
    const country = req.query.country;
  
    let searchURL = `${serverUrl}${finalPathURLS.search}`;

    if (query) {
      const encodedQuery = encodeURIComponent(query);
      searchURL += `?q=${encodedQuery}`;
    }
    
    if (lang) {
      searchURL += `${searchURL.includes('?') ? '&' : '?'}lang=${encodeURIComponent(lang)}`;
    }
    
    if (country) {
      searchURL += `${searchURL.includes('?') ? '&' : '?'}country=${encodeURIComponent(country)}`;
    }

    if (process.env.NODE_ENV === "production") {
      searchURL += `&apikey=${process.env.GNEWS_API_KEY}`;
    }

    console.log(searchURL);
    

    const response = await fetch(searchURL);
    if (!response.ok) {
      // 500 Internal Server Error
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to search news: ${response.statusText}`
      );
    }

    console.log(response);
    

    const { articles } = await response.json();
    // 200 OK
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: articles,
      totalPages: Math.ceil(articles.length / 10),
    });
  })
);

function paginate(items, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  return items.slice(startIndex, startIndex + limit);
}

export default router;
