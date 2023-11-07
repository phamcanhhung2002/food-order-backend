import { db } from "../../utils/db.server.js";
import {
  HTTP
} from "../../constants/index.js";
import * as discountService from "../discount/discount.service.js"
/* payload
    {
        orderId,
        discountId,
        foods:[
            {
                productId,
                price,
                quantity
                },
            {
                productId,
                price,
                quantity
            }
        ],    
    }

*/
const checkProductByServer=async(foods)=>{
    return await Promise.all(foods.map(async food=>{
        const foundFood=await db.Food.findFirst({where:{id:food.productId}})
        if (foundFood){
            return {
                price:foundFood.price,
                quantity:food.quantity,
                id:foundFood.id
            }
        }
    }))
}
export const checkoutReview=async({foods,discountCodeId})=>{
    // const foundOrder=await db.Order.findFirst({where:{id:orderId}})
    // if(!foundOrder) return console.log(`Order no found`,HTTP.BAD_REQUEST)
    const foundDiscocunt=await db.Voucher.findFirst({where:{code:discountCodeId}})
    if(!foundDiscocunt) return console.log(`Discount no found `,HTTP.BAD_REQUEST)
    const checkout_order={totalPrice:0,feeship:0,totalDiscount:0,totalCheckOut:0,tax:0}
    const foods_new=[]
    const checkProductServer=await checkProductByServer(foods)
    if(!checkProductServer) return console.log('food in order invalid, check again',HTTP.BAD_REQUEST)
    const checkOutPrice= await checkProductServer.reduce((acc,food)=>{
            return acc+(food.quantity*food.price)
        },0)
    const ItemCheckOut={
        discountCode:discountCodeId,
        priceRaw:checkOutPrice,
        priceApplyDiscount:checkOutPrice,
        tax:0,
        item_products:checkProductServer
    }
    if(discountCodeId!==null){
        const {amount,tax}=await discountService.getDiscountAmount({foods:checkProductServer,codeId:discountCodeId})
        checkout_order.totalDiscount+=amount
        if(amount>0){
            ItemCheckOut.priceApplyDiscount=checkOutPrice-amount-tax
        }
        ItemCheckOut.tax=tax
    }
    checkout_order.totalCheckOut+=ItemCheckOut.priceApplyDiscount
    checkout_order.totalPrice+=ItemCheckOut.priceRaw
    checkout_order.tax=ItemCheckOut.tax
    foods_new.push(ItemCheckOut)
    return {
        foods:foods,
        foods_new:foods_new,
        checkout_order
    }
}
    