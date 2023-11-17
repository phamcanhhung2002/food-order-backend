/*
  Warnings:

  - You are about to drop the column `statusId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `featuredImageId` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [Order_statusId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [Order_voucherId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Food] ADD [featuredImageId] VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[FoodsOnOrders] DROP CONSTRAINT [FoodsOnOrders_quantity_df];
ALTER TABLE [dbo].[FoodsOnOrders] ADD CONSTRAINT [FoodsOnOrders_quantity_df] DEFAULT 1 FOR [quantity];

-- AlterTable
ALTER TABLE [dbo].[Order] ALTER COLUMN [voucherId] INT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [expectedTime] DATETIME2 NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [completeTime] DATETIME2 NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [shipperPhone] VARCHAR(255) NULL;
ALTER TABLE [dbo].[Order] DROP COLUMN [statusId];
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_deliveryFee_df] DEFAULT 0 FOR [deliveryFee], CONSTRAINT [Order_tax_df] DEFAULT 0 FOR [tax];
ALTER TABLE [dbo].[Order] ADD [customerId] INT NOT NULL,
[status] INT NOT NULL CONSTRAINT [Order_status_df] DEFAULT 0;

-- DropTable
DROP TABLE [dbo].[Status];

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_voucherId_fkey] FOREIGN KEY ([voucherId]) REFERENCES [dbo].[Voucher]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
