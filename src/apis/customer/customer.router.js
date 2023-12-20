import express from "express";
import * as CustomerService from "./customer.service.js";
import { verifyRoles } from "../../middlewares/verify-roles.js";
import { USER_ROLES } from "../../constants/roles.js";
import { param, body } from "express-validator";
import { verifyUser } from "../../middlewares/verify-user.js";

export const customerRouter = express.Router();

customerRouter.get(
  "/:customerId/order",
  param("customerId").isInt({ min: 0 }).toInt(),
  verifyRoles([USER_ROLES.CUSTOMER]),
  verifyUser("customer"),
  CustomerService.getOrder
);

customerRouter.post(
  "/:customerId/order/food",
  param("customerId").isInt({ min: 0 }).toInt(),
  body("foodId").isInt({ min: 0 }).toInt(),
  verifyRoles([USER_ROLES.CUSTOMER]),
  verifyUser("customer"),
  CustomerService.addFoodToOrder
);

customerRouter.patch(
  "/:customerId/order/food/:foodId",
  param(["customerId", "foodId"]).isInt({ min: 0 }).toInt(),
  body("quantity").isInt({ min: 0 }).toInt(),
  verifyRoles([USER_ROLES.CUSTOMER]),
  verifyUser("customer"),
  CustomerService.updateQuantityOfFoodInOrder
);

customerRouter.delete(
  "/:customerId/order/food/:foodId",
  param(["customerId", "foodId"]).isInt({ min: 0 }).toInt(),
  verifyRoles([USER_ROLES.CUSTOMER]),
  verifyUser("customer"),
  CustomerService.removeFoodFromOrder
);

customerRouter.patch(
  "/:customerId/order/checkout",
  body("*")
    .isString()
    .custom((e) => e !== ""),
  param(["customerId"]).isInt({ min: 0 }).toInt(),
  verifyRoles([USER_ROLES.CUSTOMER]),
  verifyUser("customer"),
  CustomerService.checkout
);
