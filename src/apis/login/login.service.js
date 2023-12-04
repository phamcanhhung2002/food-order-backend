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
  USER_TABLE_NAME,
  STATUS,
  USER_ROLES,
} from "../../constants/index.js";

export const login = (userType) => {
  const userTableName = USER_TABLE_NAME(userType);
  return async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
    return res
  .status(HTTP.BAD_REQUEST)
  .json({ message: REQUIRED_INFO_MESSAGE });
  
  try {
    const foundUser = await db[userTableName].findUnique({
        include:
          userType === USER_ROLES.CUSTOMER
            ? {
                orders: {
                  where: {
                    status: STATUS.PENDING,
                  },
                  select: {
                    _count: {
                      select: {
                        foods: true,
                      },
                    },
                  },
                },
              }
            : {},
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
      return res.json({
        accessToken,
        userId: foundUser.id,
        numOfFoodsInOrder:
          userType === USER_ROLES.CUSTOMER
            ? foundUser.orders[0]?._count.foods || 0
            : undefined,
      });
    } catch (err) {
      next(err);
    }
  };
};
