import { DESC } from "../../constants/index.js";
import { db } from "../utils/db.server.js";

export const getAllFoods = async () => {
  return db.food.findMany({
    orderBy: {
      createdDate: DESC,
    },
  });
};
