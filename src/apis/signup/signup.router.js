import express from "express";
import * as SignupService from "./signup.service.js";

export const signupRouter = express.Router();
signupRouter.post("/", SignupService.register);
