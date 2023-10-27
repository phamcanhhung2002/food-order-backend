import express from "express";
import * as FoodService from "./food.service.js";

export const foodRouter = express.Router();

foodRouter.get("/", async (req, res) => {
  try {
    const foods = await FoodService.getAllFoods();
    return res.status(200).json({ foods });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
