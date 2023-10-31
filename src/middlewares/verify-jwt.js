import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, BEARER, HTTP } from "../constants/index.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith(BEARER)) return res.sendStatus(HTTP.UNAUTHORIZED);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(HTTP.FORBIDDEN); //invalid token
    req.userId = decoded.userInfo.id;
    req.roles = decoded.userInfo.roles;
    next();
  });
};
