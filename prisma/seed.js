import { db } from "../src/utils/db.server.js";
import fs from "fs";
import bcrypt from "bcrypt";
import {
  SEED_DATA_PATH,
  ENCODING,
  SALT_ROUNDS,
} from "../src/constants/index.js";

async function seed() {
  let categories, jsonData;
  fs.readFile(SEED_DATA_PATH, ENCODING, async (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      // Clear data
      // await db.image.deleteMany({});
      // await db.customer.deleteMany({});
      // await db.admin.deleteMany({});
      // await db.food.deleteMany({});
      // await db.category.deleteMany({});
      // Read data and create
      jsonData = JSON.parse(data);
      categories = jsonData.categories;
      await db.category.create(categories[0]);
      await db.category.create(categories[1]);
      const customer = jsonData.customer;
      const admin = jsonData.admin;
      const customerHashPassword = await bcrypt.hash(
        customer.password,
        SALT_ROUNDS
      );
      const adminHashPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);
      await db.customer.create({
        data: {
          email: customer.email,
          name: customer.name,
          hashPassword: customerHashPassword,
        },
      });
      await db.admin.create({
        data: {
          email: admin.email,
          name: admin.name,
          hashPassword: adminHashPassword,
        },
      });
    }
  });
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
