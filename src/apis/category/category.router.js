import express from "express";
import categoryController from "./category.controller.js";

export const categoryRouter = express.Router();

categoryRouter.get('/' , categoryController.getAll);
categoryRouter.post( '/', categoryController.add)
categoryRouter.delete('/:id', categoryController.remove)
categoryRouter.put('/', categoryController.update)


