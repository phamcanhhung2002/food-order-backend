import { db } from "../../utils/db.server.js";
import {
  HTTP
} from "../../constants/index.js";

export const createDiscount =async( { mininumOrder,discountValue,descript,codeId }) => {
    const foundDiscount=await db.Voucher.findFirst({where:{code:codeId}})
    if(foundDiscount) return console.log(`message:discount exists,${HTTP.BAD_REQUEST}`) //discountexists
    let results=await db.Voucher.create({
        data:
            {
                minOrder:mininumOrder,
                discount:discountValue,
                description:descript,
                code:codeId
            }
    })
    return results
}
export const getDiscountAmount=async({foods,codeId })=>{
    const foundDiscount=await db.Voucher.findFirst({where:{code:codeId}})
    if(!foundDiscount) return console.log(`message:discount no found,${HTTP.BAD_REQUEST}`) //discount not exists
    try{
        
            const {
                minOrder,
                discount
            }=foundDiscount
            let totalOrder=0
            totalOrder=await foods.reduce((acc,food)=>{
                return acc+(food.quantity*food.price)
            },0)
            if(totalOrder<minOrder){
                return console.log(`message:discount require mininum value of ${minOrder}`,HTTP.INTERNAL_SERVER_ERROR)
            }
            let amount,tax
            amount=(totalOrder*discount)/100
            tax=totalOrder*0.1
            return {
                subOrder:totalOrder,
                discount:discount,
                amount:amount,
                tax:tax,
                totalPrice: totalOrder-amount-tax
            }
            
        }catch(err){
            console.log(HTTP.INTERNAL_SERVER_ERROR);
    }

}


