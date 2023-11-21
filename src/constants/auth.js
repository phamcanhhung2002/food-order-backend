export const REQUIRED_INFO_MESSAGE = "Username and password are required.";
export const CONFLICT_USER_MESSAGE = "This username is already existed.";
export const USER_CREATED_MESSAGE = (username) =>
  `New username ${username} created!`;
export const SALT_ROUNDS = 10;
export const ACCESS_TK_EXP_TIME = "1d";
export const RERESH_TK_EXP_TIME = "1d";
export const USER_TABLE_NAME = (userRoles) =>
  userRoles == 1 ? "admin" : "customer";
export const AUTH_TYPE = "jwt";
export const COOKIE = {
  OPTION: {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  CLEAR_OPTION: {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  },
};
export const USER_ID = "userId";
export const BEARER = "Bearer ";
