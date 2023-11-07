import express from "express";
import { DESC,HTTP } from "../../constants/index.js";
import * as discountService from "./discount.service.js";

export const discountRouter = express.Router();

discountRouter.post("/create",async(req,res)=>{
    try{
        const result=await discountService.createDiscount({...req.body})
        return res.status(HTTP.OK).json({ 
            message:`Create discount success`,
            metadata:result
        });

    }catch(error){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);

    }
});
discountRouter.post("/getdiscountamount",async(req,res)=>{
    try{
        const result=await discountService.getDiscountAmount({...req.body,codeId:req.body.codeId})
        return res.status(HTTP.OK).json({ 
            message:`get amount success`,
            metadata:result
        });

    }catch(error){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);

    }
});