import express from "express";
import { query } from "express-validator";
import * as FoodService from "./food.service.js";
import {HTTP} from "../../constants/index.js";
export const foodRouter = express.Router();

foodRouter.get(
  "/best-seller",
  FoodService.getPopularFood
);
foodRouter.get(
  "/:id", FoodService.getFood
);


foodRouter.post("/add",async(req,res)=>{
  try{
    const addFood=await FoodService.addFood({...req.body,categoryId:req.body.categoryId})
    return res.status(HTTP.OK).json({
      message:`add food success`,
      metadata:addFood
    });
  }catch(error){
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);
  }
  
});
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
