export const FOODS_PER_PAGE = 20;
export const DEFAULT_PAGE = 1;
export const STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  SHIPPED: 2,
};

export const ADD_FOOD_TO_ORDER = (foodName) =>
  `Add 01 ${foodName} to cart successfully`;
export const ENTITY_NOT_FOUND = (entityName) => `${entityName} not found!`;
export const REMOVE_FOOD_FROM_ORDER = (foodName) =>
  `Remove ${foodName} from cart successfully`;
export const UPDATE_FOOD_IN_ORDER = (foodName) =>
  `Update ${foodName} in cart successfully!`;
export const PRISMA = {
  FOREIGN_KEY_FAILED: "P2003",
  RECORD_NOT_FOUND: "P2025",
};

export const CHECKOUT_SUCESS = "Checkout successfully!";
