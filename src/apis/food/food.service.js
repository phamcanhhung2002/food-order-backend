import { ASC, DESC, HTTP } from "../../constants/index.js";
import { validationResult } from "express-validator";
import { db } from "../../utils/db.server.js";

function getPagination(page, size) {
  return {
    take: size ?? 10,
    skip: (page - 1) * size
  };
}

function getWhere(filters) {
  const {
    name,
    cat,
    minPrice,
    maxPrice
  } = filters;

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

  where.currentPrice = {};

  if (minPrice) {
    where.currentPrice.gte = minPrice;
  }
  if (maxPrice) {
    where.currentPrice.lte = maxPrice;
  }

  return where;
}

function getOrderBy(sort) {
  let orderBy = [{
    id: ASC
  }]

  switch (sort) {
    case "price":
      orderBy.push({ currentPrice: ASC });
      break;
    case "fvr":
      orderBy.push({ rating: DESC });
  }

  return orderBy;
}

export const getAllFoods = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);
  let { page, size, sort } = req.query;
  size = size ?? 10;
  page = page ?? 1;

  try {
    const pagination = getPagination(page, size);
    const where = getWhere(req.query);
    const orderBy = getOrderBy(sort);

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
   
    return res.status(HTTP.OK).json({
      metaData: {
        page: page,
        size: size,
        total: total,
        numPages: Math.ceil(total / size)
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

export const getPopularFood = async (req, res) => {
  const mostOrderedFoods = await db.FoodsOnOrders.groupBy({
    by: ['foodId'],
    _count: true,
    orderBy: {
      _count: {
        foodId: 'desc'
      }
    },
    take: parseInt(req.query.num) || 4
  });

  const popularFood = await db.food.findMany({
    where: {
      id: {
        in: mostOrderedFoods.map((item) => item.foodId)
      }
    }
  })


  return res.status(200).json({data: popularFood});
}