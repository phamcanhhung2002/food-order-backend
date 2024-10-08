import { faker } from '@faker-js/faker';
import { db } from "../src/utils/db.server.js";
import bcrypt from "bcrypt";
import {
  SALT_ROUNDS,
} from "../src/constants/index.js";

function createFoodImageUrl() {
  return faker.image.urlLoremFlickr({
    category: 'food',
    height: 128,
    width: 128
  })
}

function createFoodImageUrls(num = 3) {
  const urls = [];

  for (let i = 0; i < num; ++i) {
    urls.push({
      imageId: createFoodImageUrl()
    })
  }

  return urls;
}

function createFood() {
  const price = faker.number.int({
    min: 1,
    max: 100
  });

  const currentPrice = faker.number.int({
    min: 1,
    max: price
  })

  return {
    name: faker.food.dish(),
    price,
    currentPrice,
    quantity: faker.number.int({
      min: 1,
      max: 15
    }),
    energy: faker.number.int({
      min: 1,
      max: 300
    }),
    rating: faker.number.float({
      min: 1,
      max: 4,
      fractionDigits: 1,
    }),
    featuredImageId: createFoodImageUrl(),
    images: {
      createMany: {
        data: createFoodImageUrls()
      }
    },
    introduction: faker.food.description(),
    description: faker.food.description(),
    createdDate: new Date()
  }
}

function createFoods() {
  const foods = [];

  for (let i = 0; i < 10; ++i) {
    foods.push(createFood())
  }

  return foods;
}

function createCategoryAndFoods() {
  return {
    data: {
      name: faker.food.ethnicCategory(),
      imageId: createFoodImageUrl(),
      foods: {
        create: createFoods()
      }
    }
  }
}

function createUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    email: faker.internet.email({
      firstName,
      lastName
    }),
    name: `${firstName} ${lastName}`,
    password: 'password'
  }
}

function seed() {
  return db.$transaction(async (tx) => {
    const categories = [];

    for (let i = 0; i < 10; ++i) {
      categories.push(createCategoryAndFoods())
    }
  
    const categoryPromises = categories.map(c => tx.category.create(c))
    await Promise.all(categoryPromises);
  
    const customer = createUser();
    const admin = createUser();
    const customerHashPassword = await bcrypt.hash(
      customer.password,
      SALT_ROUNDS
    );
    const adminHashPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);
  
    await tx.customer.create({
      data: {
        email: customer.email,
        name: customer.name,
        hashPassword: customerHashPassword,
      },
    });
    await tx.admin.create({
      data: {
        email: admin.email,
        name: admin.name,
        hashPassword: adminHashPassword,
      },
    });
  })
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
