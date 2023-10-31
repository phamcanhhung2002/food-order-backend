import { db } from "../src/utils/db.server.js";
import fs from "fs";
import bcrypt from "bcrypt";
import { SEED_DATA_PATH, ENCODING } from "../constants/seed.js";
import { SALT_ROUNDS } from "../constants/index.js";

async function seed() {
  let categories, jsonData;
  fs.readFile(SEED_DATA_PATH, ENCODING, async (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      jsonData = JSON.parse(data);
      categories = jsonData.categories;
      await db.category.create(categories[0]);
      await db.category.create(categories[1]);
      const customer = jsonData.customer;
      const admin = jsonData.admin;
      const customerHashKey = await bcrypt.hash(customer.password, SALT_ROUNDS);
      const adminHashKey = await bcrypt.hash(admin.password, SALT_ROUNDS);
      await db.customer.create({
        data: {
          username: customer.username,
          hashKey: customerHashKey,
        },
      });
      await db.admin.create({
        data: {
          username: admin.username,
          hashKey: adminHashKey,
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
