import { DESC,HTTP } from "../../constants/index.js";
import { db } from "../../utils/db.server.js";

export const getAllFoods = async () => {
  return db.food.findMany({
    orderBy: {
      createdDate: DESC,
    },
  });
};
export const addFood=async({
  categoryId,name,
  price,discount,
  energy,rating,
  quantity,introduction,
  description
})=>{
  const result=await db.Food.create({
    data:{
      categoryId:categoryId,
      name:name,
      price:price,
      discount:discount,
      energy:energy,
      rating:rating,
      quantity:quantity,
      introduction:introduction,
      description:description,
      createdDate:new Date()
    }
  })
  return result
}