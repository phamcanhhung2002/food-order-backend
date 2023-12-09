import express from "express";
import { query } from "express-validator";
import * as FoodService from "./food.service.js";
export const foodRouter = express.Router();

foodRouter.get(
  "/",
  query("cat")
    .optional()
    .customSanitizer((value) => value.split(",").map((e) => parseInt(e)))
    .custom((value) => {
      return !value.some((e) => isNaN(e));
    }),
  query("sort")
    .optional()
    .custom((value) => ["price", "fvr"].includes(value)),
  query(["page", "size"]).optional().isInt(0).toInt(),
  query(["minPrice", "maxPrice"]).optional().isFloat(0).toFloat(),
  FoodService.getAllFoods
);
