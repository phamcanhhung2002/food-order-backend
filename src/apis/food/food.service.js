import {
  DESC,
  DEFAULT_PAGE,
  FOODS_PER_PAGE,
  HTTP,
} from "../../constants/index.js";
import { db } from "../../utils/db.server.js";

export const getAllFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || DEFAULT_PAGE;
    // Caculate skip and take param
    const skip = (page - 1) * FOODS_PER_PAGE;
    const take = FOODS_PER_PAGE;
    const numItemsPromise = db.food.count();
    const foodsPromise = db.food.findMany({
      skip,
      take,
      orderBy: {
        createdDate: DESC,
      },
    });

    const [foods, numItems] = await Promise.all([
      foodsPromise,
      numItemsPromise,
    ]);

    const numPages = Math.ceil(numItems / FOODS_PER_PAGE);

    return res.status(HTTP.OK).json({
      pagination: {
        numItems,
        numPages,
      },
      foods,
    });
  } catch (error) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error.message);
  }
};
