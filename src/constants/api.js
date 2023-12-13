import { CLIENT_PORT } from "./enviroment.js";

export const PREFIX = {
  FOOD: "foods",
  SIGNUP: "signup",
  LOGIN: "login",
  REFRESH: "refresh",
  LOGOUT: "logout",
  CUSTOMER: "customers",
  ADMIN: "admins",
  CATEGORY: "categories",
  MENU: "menus",
};

export const CORS_OPTION = {
  origin: `http://localhost:${CLIENT_PORT}`,
  credentials: true,
};

export const API_PREFIX = "/api/v1";
