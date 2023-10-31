import express from "express";
import * as RefreshService from "./refresh.service.js";
import { PREFIX, USER_ROLES } from "../../constants/index.js";

export const refreshRouter = express.Router();

refreshRouter.get(
  `/${PREFIX.CUSTOMER}`,
  RefreshService.refreshToken(USER_ROLES.CUSTOMER)
);
refreshRouter.get(
  `/${PREFIX.ADMIN}`,
  RefreshService.refreshToken(USER_ROLES.ADMIN)
);
