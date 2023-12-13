export const REQUIRED_LOGIN_INFO_MESSAGE = "Email and password are required.";
export const REQUIRED_SIGNUP_INFO_MESSAGE =
  "Name, email and password are required.";
export const CREDITIAL_NOT_CORRECT = "Incorrect email or password.";
export const CONFLICT_USER_MESSAGE = "This email is already existed.";
export const USER_CREATED_MESSAGE = "Create account successfully;";
export const SALT_ROUNDS = 10;
export const ACCESS_TK_EXP_TIME = "30s";
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
