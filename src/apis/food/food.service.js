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
export const getFood = async (req, res, next) => {
  const { id } = req.params
  try {
    const food = await db.food.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        category: true,
        name: true,
        price: true,
        currentPrice: true,
        energy: true,
        rating: true,
        quantity: true,
        introduction: true,
        description: true,
        createdDate: true,
        featuredImageId: true,
        images: true,
      }
    })
    return res.status(200).json(food)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.message })
  }
};

export const addFood = async ({
  categoryId, name,
  price, discount,
  energy, rating,
  quantity, introduction,
  description
}) => {
  const result = await db.Food.create({
    data: {
      categoryId: categoryId,
      name: name,
      price: price,
      discount: discount,
      energy: energy,
      rating: rating,
      quantity: quantity,
      introduction: introduction,
      description: description,
      createdDate: new Date()
    }
  })
  return result
}