import express from "express";
import categoryController from "./category.controller.js";

export const categoryRouter = express.Router();

categoryRouter.get('/' , categoryController.getAll);
categoryRouter.post( '/', categoryController.add)
categoryRouter.put('/', categoryController.update)
categoryRouter.delete('/:id', categoryController.remove)
categoryRouter.post('/set-food', categoryController.setCategoryFood)


