import { db } from "../../utils/db.server.js";

class MenuController {
  getAll = async (req, res, next) => {
    const menus = await db.menu.findMany({
      select: {
        id: true,
        name: true,
        foods: true,
      },
    });
    return res.status(200).json(menus);
  };


  getOne = async (req, res, next) => {
    const { id } = req.params;
    const menus = await db.menu.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        foods: true,
      },
    });
    return res.status(200).json(menus);
  };

  
  update = async (req, res, next) => {
    const { menuId, name } = req.body;
    try {
      const newMenu = await db.menu.update({
        data: {
          name: name,
        },
        where: {
          id: parseInt(menuId),
        },
      });
      res.status(200).json({ message: "Menu updated successfully", data: newMenu });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.meta ? error.meta.cause : "Error updating menu" });
    }
  };


  removeFood = async (req, res, next) => {
    const { menuId, foodId } = req.body;

    const menu = await db.menu.findUnique({
      where: {
        id: menuId,
      },
      select: {
        foods: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!menu) return res.status(404).json({ message: "Menu not found!" });
    if (!menu.foods.map((item) => item.id).includes(foodId))
      return res.status(400).json({ message: "The food is currently not in this menu." });

    const newMenu = await db.menu.update({
      where: {
        id: menuId,
      },
      data: {
        foods: {
          disconnect: [{ id: foodId }],
        },
      },
    });

    return res.status(200).json({
      message: "The menu has been updated",
      data: newMenu,
    });
  };

  
  addFood = async (req, res, next) => {
    const { menuId, foodId } = req.body;

    const menu = await db.menu.findUnique({
      where: {
        id: menuId,
      },
      select: {
        foods: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!menu) return res.status(404).json({ message: "Menu not found!" });
    if (menu.foods.map((item) => item.id).includes(foodId))
      return res.status(400).json({ message: "The food is currently in this menu." });

    const newMenu = await db.menu.update({
      where: {
        id: menuId,
      },
      data: {
        foods: {
          connect: [{ id: foodId }],
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      message: "The menu has been updated",
      data: newMenu,
    });
  };
}
const menuController = new MenuController();

export default menuController;
