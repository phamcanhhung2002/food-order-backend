import express from "express";
import bodyParser from "body-parser";
import { foodRouter, signupRouter } from "./apis/index.js";
import { PORT, API_PREFIX, PREFIX } from "./constants/index.js";

if (!PORT) {
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${API_PREFIX}/${PREFIX.FOOD}`, foodRouter);
app.use(`${API_PREFIX}/${PREFIX.SIGNUP}`, signupRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
