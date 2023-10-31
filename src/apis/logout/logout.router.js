import express from "express";
import * as LogoutService from "./logout.service.js";
import { PREFIX, USER_ROLES } from "../../constants/index.js";

export const logoutRouter = express.Router();

logoutRouter.get(
  `/${PREFIX.CUSTOMER}`,
  LogoutService.logout(USER_ROLES.CUSTOMER)
);
logoutRouter.get(`/${PREFIX.ADMIN}`, LogoutService.logout(USER_ROLES.ADMIN));
