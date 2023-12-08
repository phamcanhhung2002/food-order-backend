import { HTTP } from "../constants/index.js";

export const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(HTTP.UNAUTHORIZED);
    }
    const result = req.roles.some((role) => allowedRoles.includes(role));
    if (!result) return res.sendStatus(HTTP.UNAUTHORIZED);
    next();
  };
};
