import express from "express";
import categoryController from "./category.controller.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";

export const categoryRouter = express.Router();

categoryRouter.get('/' , categoryController.getAll);
categoryRouter.post( '/', verifyJWT, categoryController.add)
categoryRouter.put('/', categoryController.update)
categoryRouter.delete('/:id', categoryController.remove)
categoryRouter.post('/set-food', categoryController.setCategoryFood)


