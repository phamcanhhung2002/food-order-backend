import { CLIENT_PORT } from "./enviroment.js";

export const PREFIX = {
  FOOD: "foods",
  SIGNUP: "signup",
  LOGIN: "login",
  REFRESH: "refresh",
  LOGOUT: "logout",
  CUSTOMER: "customers",
  ADMIN: "admins",
  DISCOUNT:"discount",
  CHECKOUT:"checkout",
  RATING:"rating",
  CATEGORY: "categories",
  MENU: "menus",
};

export const CORS_OPTION = {
  //origin: `http://localhost:${CLIENT_PORT}`,
  origin: `http://localhost:5174`,
  credentials: true,
};

export const API_PREFIX = "/api/v1";
