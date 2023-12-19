// import { db } from "../../utils/db.server.js";

// // await db.order.create({
//     // data: 
//     //   {
//         // voucherId: 1,
//         // subTotal: 50.0,
//         // deliveryFee: 5.0,
//         // tax: 7.5,
//         // expectedTime: new Date('2023-12-31T12:00:00Z'),
//         // shipperPhone: '123456789',
//         // customerId: 1,
//         // addressId: 1,
//     //   }
//     // })
// const orderId=2
// const foundFood=await db.FoodsOnOrders.findMany({where:{orderId:orderId}})
// const foods=[]
// const checkProductByServer=async(foods)=>{
//     return await Promise.all(foods.map(async food=>{
//         const getFoodPrice=await db.Food.findFirst({
//             where:{id:food.foodId}
//         })
//         if(getFoodPrice){
//             return {
//                 price:getFoodPrice.price,
//                 quantity:food.quantity,
//                 id:food.foodId
//             }
//         }
//     }))
// }