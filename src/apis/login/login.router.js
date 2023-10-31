import express from "express";
import * as LoginService from "./login.service.js";
import { PREFIX, USER_ROLES } from "../../constants/index.js";

export const loginRouter = express.Router();

loginRouter.post(
  `/${PREFIX.CUSTOMER}`,
  LoginService.login(USER_ROLES.CUSTOMER)
);
loginRouter.post(`/${PREFIX.ADMIN}`, LoginService.login(USER_ROLES.ADMIN));
