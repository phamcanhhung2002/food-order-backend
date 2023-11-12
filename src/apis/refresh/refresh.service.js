import {
  ACCESS_TK_EXP_TIME,
  ACCESS_TOKEN_SECRET,
  HTTP,
  REFRESH_TOKEN_SECRET,
  USER_TABLE_NAME,
} from "../../constants/index.js";
import { db } from "../../utils/db.server.js";
import jwt from "jsonwebtoken";

export const refreshToken = (userType) => {
  const userTableName = USER_TABLE_NAME(userType);
  return async (req, res, next) => {
    const cookies = req.cookies;

    const refreshToken = cookies?.jwt;
    if (!refreshToken) return res.sendStatus(HTTP.UNAUTHORIZED);

    try {
      const foundUser = await db[userTableName].findFirst({
        where: {
          refreshToken,
        },
      });

      if (!foundUser) return res.sendStatus(HTTP.FORBIDDEN); //Forbidden
      // evaluate jwt
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.id !== decoded.userId)
          return res.sendStatus(HTTP.FORBIDDEN);
        const roles = [userType];
        const accessToken = jwt.sign(
          {
            userInfo: {
              id: decoded.userId,
              roles,
            },
          },
          ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TK_EXP_TIME }
        );
        res.json({ accessToken });
      });
    } catch (err) {
      next(err);
    }
  };
};
