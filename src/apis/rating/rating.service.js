import { DESC,HTTP } from "../../constants/index.js";
import { db } from "../../utils/db.server.js";


export const mostLoved=async()=>{
    const result=await db.Food.findFirst({
        orderBy:{
            rating:'desc'
        }
    })
    return result
}