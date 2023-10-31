import express from "express";
import * as FoodService from "./food.service.js";
import { HTTP } from "../../constants/index.js";

export const foodRouter = express.Router();

foodRouter.get("/", async (req, res) => {
  try {
    const foods = await FoodService.getAllFoods();
    return res.status(HTTP.OK).json({ foods });
  } catch (error) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);
  }
});
