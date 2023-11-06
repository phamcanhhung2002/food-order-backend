import { PORT } from "./enviroment.js";

export const PREFIX = {
  FOOD: "foods",
  SIGNUP: "signup",
  LOGIN: "login",
  REFRESH: "refresh",
  LOGOUT: "logout",
  CUSTOMER: "customers",
  ADMIN: "admins",
  CATEGORY: "categories"
};

export const CORS_OPTION = {
  origin: `http://localhost:${PORT}`,
};

export const API_PREFIX = "/api/v1";
