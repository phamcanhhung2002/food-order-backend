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
          quantity: category.foods.length,
        };
      });

      res.status(200).json({
        categories: responseData,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  add = async (req, res, next) => {
    const { name } = req.body;
    console.log(req.params);
    if (!name) {
      res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid body request",
      });
    }

    try {
      const newCategory = await db.category.create({
        data: {
          name,
        },
      });

      console.log(newCategory);

      res.status(200).json({
        message: "Category added successfully",
        data: newCategory,
      });
    } catch (error) {}
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
        res.status(404).json({
          message: "Category not found",
        });

      await db.category.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        message: `Category id ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    const { id, name, quantity } = req.body;
    if (!id) res.sendStatus(HTTP.BAD_REQUEST);
    if (quantity < 0) {
      res.status(200).json({
        message: "Category added successfully",
        data: newCategory,
      });
    }
    try {
      const category = await db.category.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!category)
        res.status(404).json({
          message: "Category not found",
        });

      const updatedCategory = await db.category.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          quantity,
        },
      });

      res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  setCategoryFood = async (req, res, next) => {
    console.log(req.body)
    const foodId = parseInt(req.body.foodId);
    const categoryId = parseInt(req.body.categoryId)
    if (!foodId || !categoryId) {
        res.status(HTTP.BAD_REQUEST).json({
            message: 'Invalid or missing parameter in the request body'
        }) 
    }

    try {
        const food = await db.food.findUnique({
            where: { id: foodId}
        })
        if (!food) res.status(HTTP.BAD_REQUEST).json({
            message: "Food not found"
        })
        const category = await db.category.findUnique({
            where: { id: categoryId }
        })
        if (!category) res.status(HTTP.BAD_REQUEST).json({
            message: "Category not found"
        })
        
        const foodUpdated = await db.food.update({
            where: { id: foodId },
            data: {
                categoryId: categoryId
            }
        })

        res.status(HTTP.OK).json({
            message: 'Food updated successfully',
            data: foodUpdated
        })

    } catch (error) {
        console.log(error)
        next(error)
    }

  };
}

const categoryController = new CategoryController();
export default categoryController;
