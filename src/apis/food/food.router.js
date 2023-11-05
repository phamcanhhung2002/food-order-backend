import express from "express";
import * as FoodService from "./food.service.js";

export const foodRouter = express.Router();

foodRouter.get("/", FoodService.getAllFoods);
