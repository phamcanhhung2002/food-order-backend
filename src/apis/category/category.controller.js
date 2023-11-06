import { HTTP } from "../../constants/http-code.js";
import { db } from "../../utils/db.server.js";

class CategoryController {
    getAll =  async (req, res, next) => {
        try {
            const categories = await db.category.findMany()
            res.status(200).json(categories);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    add = async (req, res, next) => {
        const { name, quantity } = req.body;
        console.log(req.params)
        console.log(name, quantity)
        if (!name || !quantity) {
            res.sendStatus(HTTP.BAD_REQUEST)
        }

        if (quantity < 0) res.status(200).json({
            message: 'Invalid quantity must be greater than zero'
        })
        try {
            const newCategory = await db.category.create({
                data: {
                    name,
                    quantity
                }
            })

            console.log(newCategory)
            
            res.status(200).json({
                message: 'Category added successfully',
                data: newCategory
            })
            
        } catch (error) {
            
        }
    }
    remove = async (req, res, next) => {
        const { id } = req.params
        if (!id) res.sendStatus(HTTP.BAD_REQUEST)
        
        try {
            const category = await db.category.findUnique({
                where: {
                  id: parseInt(id),
                },
            })
            if (!category) res.status(404).json({
                message: 'Category not found'
            })

            await db.category.delete({
                where: {
                  id: parseInt(id),
                },
            })

            res.status(200).json({
                message: `Category id ${id} deleted successfully`
            })

        } catch (error) {
            next(error)
        }
    }
    update = async (req, res, next) => {
        const {id, name, quantity} = req.body
        if (!id) res.sendStatus(HTTP.BAD_REQUEST)
        if (quantity < 0) {
            res.status(200).json({
                message: 'Category added successfully',
                data: newCategory
            })
        }
        try {
            const category = await db.category.findUnique({
                where: {
                  id: parseInt(id),
                },
            })
            if (!category) res.status(404).json({
                message: 'Category not found'
            })

            const updatedCategory = await db.category.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    quantity
                }
            })

            res.status(200).json({
                message: 'Category updated successfully',
                data: updatedCategory
            })

        } catch (error) {
            next(error)
        }
    }
}

const categoryController = new CategoryController()
export default categoryController;
