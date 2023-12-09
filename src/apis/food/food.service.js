import { ASC, DESC, HTTP } from "../../constants/index.js";
import { validationResult } from "express-validator";
import { db } from "../../utils/db.server.js";

export const getAllFoods = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);
  let { page, size, name, cat, sort, minPrice, maxPrice } = req.query;

  try {
    const pagination = {};
    if (size) {
      pagination.take = size;
      if (page) {
        pagination.skip = (page - 1) * size;
      }
    }
    const where = {};
    if (name) {
      where.name = {
        contains: name,
      };
    }

    if (cat) {
      where.categoryId = {
        in: cat,
      };
    }

    let orderBy = undefined;
    switch (sort) {
      case "price":
        orderBy = { currentPrice: ASC };
        break;
      case "fvr":
        orderBy = { rating: DESC };
    }

    where.currentPrice = {};
    if (minPrice) {
      where.currentPrice.gte = minPrice;
    }
    if (maxPrice) {
      where.currentPrice.lte = maxPrice;
    }
    const select = {
      id: true,
      name: true,
      price: true,
      currentPrice: true,
      featuredImageId: true,
    };

    const [total, foods] = await db.$transaction([
      db.food.count({ where }),
      db.food.findMany({
        select,
        ...pagination,
        where,
        orderBy,
      }),
    ]);

    res.status(HTTP.OK).json({
      metaData: {
        page: page,
        size: size,
        total: total,
      },
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};
