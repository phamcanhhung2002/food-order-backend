import express from "express";
import categoryController from "./category.controller.js";
import { USER_ROLES } from "../../constants/roles.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { verifyRoles } from "../../middlewares/verify-roles.js";

export const categoryRouter = express.Router();
categoryRouter.get("/", categoryController.getAll);
categoryRouter.post("/", verifyJWT, verifyRoles([USER_ROLES.ADMIN]), categoryController.add);
categoryRouter.put("/", verifyJWT, verifyRoles([USER_ROLES.ADMIN]), categoryController.update);
categoryRouter.delete("/:id", verifyJWT, verifyRoles([USER_ROLES.ADMIN]), categoryController.remove);
categoryRouter.put("/set-food", verifyJWT, verifyRoles([USER_ROLES.ADMIN]), categoryController.setCategoryFood);
