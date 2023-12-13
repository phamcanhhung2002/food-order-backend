import { HTTP } from "../../constants/http-code.js";
import { db } from "../../utils/db.server.js";

class CategoryController {
  getAll = async (req, res, next) => {
    try {
      const categories = await db.category.findMany({
        include: {
          foods: {
            select: {
              id: true,
            },
          },
        },
      });

      const responseData = categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          imageId: category.imageId,
          quantity: category.foods.length,
        };
      });

      return res.status(200).json({
        categories: responseData,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  add = async (req, res, next) => {
    const { name, imageId } = req.body;
    if (!name) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid body request",
      });
    }

    try {
      const newCategory = await db.category.create({
        data: {
          name,
          imageId,
        },
      });

      return res.status(200).json({
        message: "Category added successfully",
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    const { id } = req.params;
    if (!id) res.sendStatus(HTTP.BAD_REQUEST);

    try {
      const category = await db.category.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!category)
        return res.status(404).json({
          message: "Category not found",
        });

      await db.category.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json({
        message: `Category id ${id} deleted successfully`,
      });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };

  update = async (req, res, next) => {
    const { id, name, imageId } = req.body;
    if (!id) return res.sendStatus(HTTP.BAD_REQUEST);
    try {
      const category = await db.category.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      console.log(category);
      if (!category)
        return res.status(404).json({
          message: "Category not found",
        });

      const updatedCategory = await db.category.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          imageId,
        },
      });

      return res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  setCategoryFood = async (req, res, next) => {
    const foodId = parseInt(req.body.foodId);
    const categoryId = parseInt(req.body.categoryId);
    if (!foodId || !categoryId) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid or missing parameter in the request body",
      });
    }

    try {
      const food = await db.food.findUnique({
        where: { id: foodId },
      });
      if (!food)
        return res.status(HTTP.BAD_REQUEST).json({
          message: "Food not found",
        });
      const category = await db.category.findUnique({
        where: { id: categoryId },
      });
      if (!category)
        return res.status(HTTP.BAD_REQUEST).json({
          message: "Category not found",
        });

      const foodUpdated = await db.food.update({
        where: { id: foodId },
        data: {
          categoryId: categoryId,
        },
      });

      return res.status(HTTP.OK).json({
        message: "Food updated successfully",
        data: foodUpdated,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

const categoryController = new CategoryController();
export default categoryController;
