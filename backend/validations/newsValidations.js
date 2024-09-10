import { query } from "express-validator";

export const searchValidationRules = [
  query("q")
    .notEmpty()
    .withMessage("Query parameter is required")
    .trim()
    .isString()
    .withMessage("Query parameter must be a string")
    .isLength({ min: 1 })
    .withMessage("Query parameter must be at least 1 character long"),

  query("lang")
    .optional()
    .isString()
    .withMessage("Language code must be a string")
    .isLength({ min: 2, max: 2 })
    .withMessage("Language code must be exactly 2 characters long"),
    
  query("country")
    .optional()
    .isString()
    .withMessage("Country code must be a string")
    .isLength({ min: 2, max: 2 })
    .withMessage("Country code must be exactly 2 characters long"),
];

export const headlinesValidationRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];
