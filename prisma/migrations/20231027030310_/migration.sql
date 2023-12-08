BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Category] ADD CONSTRAINT [Category_quantity_df] DEFAULT 0 FOR [quantity];

-- AlterTable
ALTER TABLE [dbo].[Food] ADD CONSTRAINT [Food_quantity_df] DEFAULT 0 FOR [quantity];

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Image] (
    [id] INT NOT NULL IDENTITY(1,1),
    [foodId] INT NOT NULL,
    [imageId] VARCHAR(255) NOT NULL,
    CONSTRAINT [Image_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Review] (
    [id] INT NOT NULL IDENTITY(1,1),
    [foodId] INT NOT NULL,
    [content] TEXT NOT NULL,
    CONSTRAINT [Review_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Voucher] (
    [id] INT NOT NULL IDENTITY(1,1),
    [minOrder] INT NOT NULL,
    [discount] SMALLMONEY NOT NULL,
    [description] VARCHAR(255) NOT NULL,
    [code] VARCHAR(255) NOT NULL,
    CONSTRAINT [Voucher_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Status] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Status_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] INT NOT NULL IDENTITY(1,1),
    [voucherId] INT NOT NULL,
    [statusId] INT NOT NULL,
    [subTotal] SMALLMONEY NOT NULL,
    [deliveryFee] SMALLMONEY NOT NULL,
    [tax] DECIMAL(4,2) NOT NULL,
    [expectedTime] DATETIME2 NOT NULL,
    [completeTime] DATETIME2 NOT NULL,
    [shipperPhone] VARCHAR(255) NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FoodsOnOrders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [foodId] INT NOT NULL,
    [orderId] INT NOT NULL,
    [quantity] INT NOT NULL CONSTRAINT [FoodsOnOrders_quantity_df] DEFAULT 0,
    CONSTRAINT [FoodsOnOrders_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FoodsOnOrders_foodId_orderId_key] UNIQUE NONCLUSTERED ([foodId],[orderId])
);

-- CreateTable
CREATE TABLE [dbo].[Phone] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressId] INT NOT NULL,
    [number] VARCHAR(11) NOT NULL,
    CONSTRAINT [Phone_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [customerId] INT NOT NULL,
    [street] VARCHAR(255) NOT NULL,
    [district] VARCHAR(255) NOT NULL,
    [city] VARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [firstName] VARCHAR(255) NOT NULL,
    [lastName] VARCHAR(255) NOT NULL,
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(255) NOT NULL,
    [hashKey] VARCHAR(255) NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Customer_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Admin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(255) NOT NULL,
    [hashKey] VARCHAR(255) NOT NULL,
    CONSTRAINT [Admin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Admin_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[_FoodToTag] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_FoodToTag_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_FoodToMenu] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_FoodToMenu_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CustomerToFood] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CustomerToFood_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_FoodToTag_B_index] ON [dbo].[_FoodToTag]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_FoodToMenu_B_index] ON [dbo].[_FoodToMenu]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CustomerToFood_B_index] ON [dbo].[_CustomerToFood]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Image] ADD CONSTRAINT [Image_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_voucherId_fkey] FOREIGN KEY ([voucherId]) REFERENCES [dbo].[Voucher]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[Status]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FoodsOnOrders] ADD CONSTRAINT [FoodsOnOrders_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FoodsOnOrders] ADD CONSTRAINT [FoodsOnOrders_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Phone] ADD CONSTRAINT [Phone_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Address] ADD CONSTRAINT [Address_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_FoodToTag] ADD CONSTRAINT [_FoodToTag_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Food]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_FoodToTag] ADD CONSTRAINT [_FoodToTag_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_FoodToMenu] ADD CONSTRAINT [_FoodToMenu_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Food]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_FoodToMenu] ADD CONSTRAINT [_FoodToMenu_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Menu]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CustomerToFood] ADD CONSTRAINT [_CustomerToFood_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CustomerToFood] ADD CONSTRAINT [_CustomerToFood_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Food]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
