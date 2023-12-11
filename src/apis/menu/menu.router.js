import express from "express";
import menuController from "./menu.controller.js";
export const menuRouter = express.Router();
import { USER_ROLES } from "../../constants/roles.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { verifyRoles } from "../../middlewares/verify-roles.js";

menuRouter.get("/:id", menuController.getOne);
menuRouter.get("/", menuController.getAll);
menuRouter.put("/", verifyJWT, verifyRoles([USER_ROLES.ADMIN]), menuController.update);
menuRouter.put("/remove",verifyJWT, verifyRoles([USER_ROLES.ADMIN]),  menuController.removeFood);
menuRouter.put("/add",verifyJWT, verifyRoles([USER_ROLES.ADMIN]),  menuController.addFood);
