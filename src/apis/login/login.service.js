import { db } from "../../utils/db.server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TK_EXP_TIME,
  COOKIE,
  AUTH_TYPE,
  REQUIRED_INFO_MESSAGE,
  RERESH_TK_EXP_TIME,
  HTTP,
  USER_ID,
  USER_TABLE_NAME,
} from "../../constants/index.js";

export const login = (userType) => {
  const userTableName = USER_TABLE_NAME(userType);
  return async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: REQUIRED_INFO_MESSAGE });
    const foundUser = await db[userTableName].findUnique({
      where: {
        username,
      },
    });
    if (!foundUser) return res.sendStatus(HTTP.UNAUTHORIZED); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.hashPassword);
    if (!match) return res.sendStatus(HTTP.UNAUTHORIZED); //Unauthorized

    const roles = [userType];
    // create JWTs
    const accessToken = jwt.sign(
      {
        userInfo: {
          id: foundUser.id,
          roles,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TK_EXP_TIME }
    );
    const refreshToken = jwt.sign(
      { userId: foundUser.id },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: RERESH_TK_EXP_TIME,
      }
    );

    await db[userTableName].update({
      where: {
        id: foundUser.id,
      },
      data: {
        refreshToken,
      },
    });

    res.cookie(AUTH_TYPE, refreshToken, COOKIE.OPTION);
    res.cookie(USER_ID, foundUser.id);
    res.json({ accessToken });
  };
};
