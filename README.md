# Food Order Backend

> RESTful API for food order system, customer can search for foods and order them.

## Table of Contents

* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
<!-- * [License](#license) -->

## General Information

This project to help food enthusiasts to enjoy amazing, delicious dishes conveniently

## Technologies Used

* ReactJS
* NodeJS
* SQL Server

## Features

Customers can:

* View all dishses, food categories.
* View details of dishs, add them to the cart and pay for them.

## Setup

Before you run this project, download the frontend source code of it [here](https://github.com/phamcanhhung2002/food-order-frontend).

Also, make you sure you installed these:

* NodeJS 18.
* SQL Server 2022.

Then you need to create a .env files based on .env.example files in the codebase.

## Usage

To run the project:

* In this folder, run:

```sh
npm install
```

```sh
npx prisma db seed
```

```sh
npm start
```

* Then, go to the frontend folder, run:

```sh
npm install
```

```sh
npm run dev
```

After all servers have run. You can access the website via: <http://localhost:3000>
