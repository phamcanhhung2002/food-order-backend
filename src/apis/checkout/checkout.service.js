import { db } from "../../utils/db.server.js";
import { HTTP, STATUS } from "../../constants/index.js";
import * as discountService from "../discount/discount.service.js"
/* payload
    {
    "discountCodeId":"AN-1112",
    "customerId":2,
    "orderId":1,
    "address":
        {
            "id":1,
            "street":"Le Van Luong",
            "district":"4",
            "city":"HCM",
            "email":"@gmail.com",
            "firstName":"AN",
            "lastName":"AN",
            "zipCode":"8400",
            "company":"Biu-2rack",
            "address1":"919 Ly Chinh Thang Phuong 9 Quan 9",
            "country":"Viet Nam"
        
    }
}

*/
const checkProductByServer=async(foods)=>{
    return await Promise.all(foods.map(async food=>{
        const foundFood=await db.Food.findFirst({
            where:{id:food.foodId}
        })
        if(foundFood){
            return {
                price:foundFood.currentPrice,
                quantity:food.quantity,
                id:food.foodId
            }
        }
    }))
}
export const checkoutReview=async({orderId,customerId,discountCodeId,address})=>{
    let updateOrderaddress
    const foundOrder=await db.Order.findFirst({where:{id:orderId}})
    if(!foundOrder) throw new Error(`Order no found`)
    
    const foundAddress=await db.Address.findFirst({where:{id:address.id}})
    if(foundAddress){
        updateOrderaddress=await db.Order.update({where:{id:orderId},data:{addressId:foundAddress.id}})
    }
    if(!foundAddress){
        const newAddress=await db.Address.create({
            data:{
                customerId:customerId,
                phone:address.phone,
                city:address.city,
                email:address.email,
                firstName:address.firstName,
                lastName:address.lastName,
                zipCode:address.zipCode,
                company:address.company,
                address1:address.address1,
                country:address.country
            },
        })
        updateOrderaddress=await db.Order.update({where:{id:orderId},data:{addressId:newAddress.id}})

    }
    if(!updateOrderaddress) throw new Error(`Error while update order address`)
    const foundDiscocunt=await db.Voucher.findFirst({where:{code:discountCodeId}})
    if(!foundDiscocunt) throw new Error(`message:Discount no found:${HTTP.BAD_REQUEST}`)
    const checkout_order={totalPrice:0,feeship:0,totalDiscount:0,totalCheckOut:0,tax:0}
    const foods_new=[]
    const foods=await db.FoodsOnOrders.findMany({where:{orderId:orderId}})
    const checkProductServer=await checkProductByServer(foods)
    if(!checkProductServer) throw new Error('food in order invalid, check again',HTTP.BAD_REQUEST)
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
    await db.Order.update({where:{id:orderId},data:{status:STATUS.COMPLETED,voucherId:foundDiscocunt.id,tax:checkout_order.tax}})
    return {
        foods:foods,
        foods_new:foods_new,
        checkout_order
    }
}
export const getDiscountTotal=async({orderId,customerId,discountCodeId})=>{
    const foundOrder=await db.Order.findFirst({where:{id:orderId}})
    if(!foundOrder) throw new Error(`Order no found`)
    const foundDiscocunt=await db.Voucher.findFirst({where:{code:discountCodeId}})
    if(!foundDiscocunt) throw new Error(`message:Discount no found:${HTTP.BAD_REQUEST}`)
    const checkout_order={totalPrice:0,feeship:0,totalDiscount:0,totalCheckOut:0,tax:0}
    const foods_new=[]
    const foods=await db.FoodsOnOrders.findMany({where:{orderId:orderId}})
    const checkProductServer=await checkProductByServer(foods)
    if(!checkProductServer) throw new Error('food in order invalid, check again',HTTP.BAD_REQUEST)
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
    await db.Order.update({where:{id:orderId},data:{status:STATUS.COMPLETED,voucherId:foundDiscocunt.id,tax:checkout_order.tax}})
    return {
        foods:foods,
        foods_new:foods_new,
        checkout_order
    }
}
