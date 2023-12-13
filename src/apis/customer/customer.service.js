import { validationResult } from "express-validator";
import {
  ENTITY_NOT_FOUND,
  HTTP,
  PRISMA,
  STATUS,
} from "../../constants/index.js";
import { db } from "../../utils/db.server.js";

const orderSelect = {
  id: true,
  subTotal: true,
  deliveryFee: true,
  tax: true,
  foods: {
    select: {
      food: {
        select: {
          id: true,
          name: true,
          currentPrice: true,
          rating: true,
          featuredImageId: true,
        },
      },
      quantity: true,
    },
  },
  _count: {
    select: {
      foods: true,
    },
  },
  voucher: {
    select: {
      discount: true,
      code: true,
    },
  },
};

const findCurrentOrder = (select, customerId) => {
  return db.order.findFirst({
    select,
    where: {
      customerId,
      status: STATUS.PENDING,
    },
  });
};

const findFoodById = (select, id) => {
  return db.food.findUnique({
    select,
    where: {
      id,
    },
  });
};

const updateOrder = (orderId, foodId, foodCurrentPrice) => {
  // Update the quantity of the food in order
  // or add the food to the current order
  const foodsOnOrdersPromise = db.foodsOnOrders.upsert({
    select: {
      id: true,
    },
    where: {
      foodId_orderId: {
        foodId,
        orderId,
      },
    },
    create: {
      foodId,
      orderId,
    },
    update: {
      quantity: {
        increment: 1,
      },
    },
  });
  // Update the subtotal of the order
  const orderPromise = db.order.update({
    select: { id: true },
    where: {
      id: orderId,
    },
    data: {
      subTotal: {
        increment: foodCurrentPrice,
      },
    },
  });
  return db.$transaction([orderPromise, foodsOnOrdersPromise]);
};

export const getOrder = async (req, res, next) => {
  // Check the errors of the request
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);

  const { customerId } = req.params;

  try {
    // Find the current order
    const order = await findCurrentOrder(orderSelect, customerId);

    if (order) {
      order.total = order._count.foods;
      order._count = undefined;
    }
    return res.json({ order });
  } catch (e) {
    next(e);
  }
};

export const addFoodToOrder = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);
  const { customerId } = req.params;
  const { foodId } = req.body;
  let order = null;
  try {
    /* Might use raw SQL querys later for improvement */
    // Get the food's current price
    const food = await findFoodById(
      {
        name: true,
        currentPrice: true,
      },
      foodId
    );
    // Food not found
    if (!food) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ message: ENTITY_NOT_FOUND("Food") });
    }
    // Get the current order
    const currentOrder = await findCurrentOrder({ id: true }, customerId);

    // Do not have order yet, so create one
    // and also add the food to the new order
    if (!currentOrder) {
      try {
        // Might throw foreign key exception if customer not found
        order = await db.order.create({
          select: orderSelect,
          data: {
            customerId,
            subTotal: food.currentPrice,
            foods: {
              create: {
                foodId,
              },
            },
          },
        });
      } catch (err) {
        if (err.code === PRISMA.FOREIGN_KEY_FAILED) {
          return res
            .status(HTTP.NOT_FOUND)
            .json({ message: ENTITY_NOT_FOUND("Customer") });
        }

        throw err;
      }
    } else {
      await updateOrder(currentOrder.id, foodId, food.currentPrice);
      order = await findCurrentOrder(orderSelect, customerId);
    }
    console.log(order);
    order.total = order._count.foods;
    order._count = undefined;
    return res.json({ order });
  } catch (err) {
    next(err);
  }
};

export const updateQuantityOfFoodInOrder = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);
  const { customerId, foodId } = req.params;
  const { quantity } = req.body;
  if (quantity === 0) {
    return removeFoodFromOrder(req, res, next);
  }
  // Get the current order
  const currentOrder = await findCurrentOrder({ id: true }, customerId);
  if (!currentOrder)
    return res
      .status(HTTP.NOT_FOUND)
      .json({ message: ENTITY_NOT_FOUND("Order") });

  /* Might use raw SQL querys later for improvement */
  try {
    // Remove the food from order
    // Might throw error if food not found
    const currentFoodsOnOrders = await db.foodsOnOrders.findUnique({
      select: {
        food: {
          select: {
            name: true,
            currentPrice: true,
          },
        },
        quantity: true,
      },
      where: {
        foodId_orderId: {
          foodId,
          orderId: currentOrder.id,
        },
      },
    });

    if (!currentFoodsOnOrders)
      return res.status(HTTP.NOT_FOUND).json({
        message: ENTITY_NOT_FOUND("Food"),
      });

    const foodsOnOrdersPromise = db.foodsOnOrders.update({
      select: {
        id: true,
      },
      where: {
        foodId_orderId: {
          foodId,
          orderId: currentOrder.id,
        },
      },
      data: {
        quantity,
      },
    });
    const orderPromise = db.order.update({
      select: orderSelect,
      where: {
        id: currentOrder.id,
      },
      data: {
        subTotal: {
          increment:
            currentFoodsOnOrders.food.currentPrice *
            (quantity - currentFoodsOnOrders.quantity),
        },
      },
    });
    const [_, order] = await db.$transaction([
      foodsOnOrdersPromise,
      orderPromise,
    ]);

    if (order) {
      order.total = order._count.foods;
      order._count = undefined;
    }
    return res.json({
      order,
    });
  } catch (err) {
    if (err.code === PRISMA.RECORD_NOT_FOUND) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ message: ENTITY_NOT_FOUND("Food") });
    }

    next(err);
  }
};

export const removeFoodFromOrder = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(HTTP.BAD_REQUEST);
  const { customerId, foodId } = req.params;
  // Get the current order
  const currentOrder = await findCurrentOrder({ id: true }, customerId);
  if (!currentOrder)
    return res
      .status(HTTP.NOT_FOUND)
      .json({ message: ENTITY_NOT_FOUND("Order") });
  try {
    /* Might use raw SQL querys later for improvement */
    let foodsOnOrders;
    try {
      // Remove the food from order
      // Might throw error if food not found
      foodsOnOrders = await db.foodsOnOrders.delete({
        select: {
          food: {
            select: {
              name: true,
              currentPrice: true,
            },
          },
          quantity: true,
        },
        where: {
          foodId_orderId: {
            foodId,
            orderId: currentOrder.id,
          },
        },
      });
    } catch (err) {
      if (err.code === PRISMA.RECORD_NOT_FOUND) {
        return res
          .status(HTTP.NOT_FOUND)
          .json({ message: ENTITY_NOT_FOUND("Food") });
      }

      throw err;
    }
    // Update the subtotal of the order
    let order = await db.order.update({
      select: orderSelect,
      where: {
        id: currentOrder.id,
      },
      data: {
        subTotal: {
          decrement: foodsOnOrders.food.currentPrice * foodsOnOrders.quantity,
        },
      },
    });

    if (order) {
      order.total = order._count.foods;
      order._count = undefined;
    }

    if (order.total === 0) {
      // There is not any food in the order
      // so delete it
      await db.order.delete({
        where: {
          id: order.id,
        },
      });

      order = null;
    }

    return res.json({ order });
  } catch (err) {
    next(err);
  }
};
