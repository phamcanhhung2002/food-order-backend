import { PrismaClient } from "@prisma/client";
import { NODE_ENV, ENV_MODE } from "../constants/index.js";

let db;

if (!global.__db) {
  if (NODE_ENV === ENV_MODE.DEVELOPMENT) {
    global.__db = new PrismaClient({
      log: ['query']
    });

    global.__db.$on('query', (e) => {
      console.log('Params: ' + e.params)
      console.log('Duration: ' + e.duration + 'ms')
    })
  } else {
    global.__db = new PrismaClient();
  }
}

db = global.__db;

export { db };
