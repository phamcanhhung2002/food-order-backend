import "dotenv/config";

export const ENV_MODE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
}
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
