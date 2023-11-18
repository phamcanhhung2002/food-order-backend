import express from "express";
import * as FoodService from "./food.service.js";
import {HTTP} from "../../constants/index.js";
export const foodRouter = express.Router();

foodRouter.get("/", FoodService.getAllFoods);
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