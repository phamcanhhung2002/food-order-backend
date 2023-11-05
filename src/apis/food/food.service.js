import {
  DESC,
  DEFAULT_PAGE,
  FOODS_PER_PAGE,
  HTTP,
  SORT_OPTIONS,
  ASC,
  DEFAULT_SORT_OPTION,
} from "../../constants/index.js";
import { db } from "../../utils/db.server.js";

const validateParams = (req) => {
  let { page, sort, ord, cat, price } = req.query;

  // If not send, use default options
  page = parseInt(page) || DEFAULT_PAGE;
  ord = ord || DESC;
  sort = sort || DEFAULT_SORT_OPTION;
  // If not send, mean don't filter using these params
  cat = parseInt(cat);
  let maxPrice, minPrice;
  if (price) {
    [minPrice, maxPrice] = price.split("-").map((p) => parseFloat(p));
  }

  // If specify page, it must be greater than zero
  // If specify sort, it must be in sort options
  // If specify ord, it must be in order options
  // if specify price, both min and max must be not nullish
  const isBadParams =
    page < 0 ||
    !SORT_OPTIONS.includes(sort) ||
    ![DESC, ASC].includes(ord) ||
    (maxPrice && !minPrice) ||
    (!maxPrice && minPrice);

  return { page, ord, sort, cat, minPrice, maxPrice, isBadParams };
};

export const getAllFoods = async (req, res) => {
  try {
    const { page, ord, sort, cat, minPrice, maxPrice, isBadParams } =
      validateParams(req);
    if (isBadParams) return res.sendStatus(HTTP.BAD_REQUEST);

    // Caculate skip and take param
    const skip = (page - 1) * FOODS_PER_PAGE;
    const take = FOODS_PER_PAGE;

    // Create orderBy
    const orderBy = {};
    orderBy[sort] = ord;

    // Create where
    const where = {};
    if (cat) where.categoryId = cat;
    if (minPrice) where.currentPrice = { gte: minPrice, lte: maxPrice };

    const numItemsPromise = db.food.count({ where });
    const foodsPromise = db.food.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        price: true,
        currentPrice: true,
        images: {
          select: {
            imageId: true,
          },
        },
      },
      where,
      orderBy,
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
