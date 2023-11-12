import { HTTP, SERVER_ERROR_MESSAGE } from "../constants/index.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  console.log(err.message);
  return res
    .status(HTTP.INTERNAL_SERVER_ERROR)
    .json({ message: SERVER_ERROR_MESSAGE });
};
