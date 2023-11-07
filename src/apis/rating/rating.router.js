import express from "express";
import { DESC,HTTP } from "../../constants/index.js";
import * as ratingService from "./rating.service.js";

export const RatingRouter = express.Router();

RatingRouter.get("/mostloved",async(req,res)=>{
    try{
        const mostLoved=await ratingService.mostLoved()
        return res.status(HTTP.OK).json({ 
            message:`find most loved success`,
            metadata:mostLoved
        });

    }catch(error){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);

    }
});
