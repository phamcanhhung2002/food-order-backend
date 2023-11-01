import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  foodRouter,
  loginRouter,
  logoutRouter,
  signupRouter,
  refreshRouter,
  discountRouter,
} from "./apis/index.js";
import { PORT, API_PREFIX, PREFIX, CORS_OPTION } from "./constants/index.js";
import { verifyJWT } from "./middlewares/verify-jwt.js";

if (!PORT) {
  process.exit(1);
}

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORS_OPTION));

app.use(`${API_PREFIX}/${PREFIX.SIGNUP}`, signupRouter);
app.use(`${API_PREFIX}/${PREFIX.LOGIN}`, loginRouter);
app.use(`${API_PREFIX}/${PREFIX.LOGOUT}`, logoutRouter);
app.use(`${API_PREFIX}/${PREFIX.REFRESH}`, refreshRouter);
app.use(`${API_PREFIX}/${PREFIX.DISCOUNT}`, discountRouter);
app.use(verifyJWT);
app.use(`${API_PREFIX}/${PREFIX.FOOD}`, foodRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
