import { PORT } from "./enviroment.js";

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
  RATING:"rating"
};

export const CORS_OPTION = {
  origin: `http://localhost:${PORT}`,
};

export const API_PREFIX = "/api/v1";
