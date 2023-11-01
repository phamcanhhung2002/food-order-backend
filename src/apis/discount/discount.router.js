import express from "express";
import * as discountService from "./discount.service.js";

export const discountRouter = express.Router();

discountRouter.post("/create", discountService.createDiscount);
discountRouter.post("/getdiscountamount", discountService.getDiscountAmount);