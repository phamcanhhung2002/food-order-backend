import { db } from "../../utils/db.server.js";
import {
  HTTP
} from "../../constants/index.js";

export const createDiscount =async (req, res) => {
    const { mininumOrder,discountValue,descript,codeId } = req.body;
    console.log(codeId)
    const foundCode=await db.Voucher.findFirst({where:{code:codeId}})
    if (foundCode) return res.sendStatus(HTTP.BAD_REQUEST); //Already exists
    try{
        let results=await db.Voucher.create({
            data:
                {
                    minOrder:mininumOrder,
                    discount:discountValue,
                    description:descript,
                    code:codeId
                }
        })
        res.status(HTTP.CREATED).json({ success: results });
    }catch(err){
        res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }

}
export const getDiscountAmount=async(req,res)=>{
    const { products,codeId } = req.body;
    const foundDiscount=await db.Voucher.findFirst({where:{code:codeId}})
       
    if(!foundDiscount)  return res.sendStatus(HTTP.BAD_REQUEST); //discount not exists
    try{
            const {
                minOrder,
                discount
            }=foundDiscount
            let totalOrder=0
            if(minOrder>0){
                totalOrder=products.reduce((acc,product)=>{
                    return acc+(product.quantity*product.price)
                },0)
                if(totalOrder<minOrder){
                    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: err.message });
                }
            }
            let amount
            amount=discount
            res.status(HTTP.CREATED).json({ totalOrder,
                discount:amount,
                totalPrice:totalOrder-amount });
            return {
                totalOrder,
                discount:amount,
                totalPrice:totalOrder-amount
            }
        }catch(err){
            res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }

}


