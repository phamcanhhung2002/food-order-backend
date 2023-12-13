import express from "express";
import {HTTP} from "../../constants/index.js";
import * as checkoutService from "./checkout.service.js";
export const checkoutRouter = express.Router();

checkoutRouter.post("/checkoutReview",async(req,res)=>{
    try{
        const checkoutReview=await checkoutService.checkoutReview(req.body)
        return res.status(HTTP.OK).json({ 
            message:`checkout review success`,
            metadata:checkoutReview
        })
    }catch(error){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);

    }
})