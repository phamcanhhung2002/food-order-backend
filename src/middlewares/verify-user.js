import { HTTP } from "../constants/index.js";

export const verifyUser = (userType) => {
  return (req, res, next) => {
    if (req.userId !== req.params[`${userType}Id`]){
      return res.sendStatus(HTTP.FORBIDDEN);
    }
    next();
  };
};
