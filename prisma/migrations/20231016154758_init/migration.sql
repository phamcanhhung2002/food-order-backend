BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [quantity] INT NOT NULL, 
    CONSTRAINT [Category_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Food] (
    [id] INT NOT NULL IDENTITY(1,1),
    [categoryId] INT NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [price] SMALLMONEY NOT NULL,
    [discount] SMALLMONEY NOT NULL,
    [energy] INT NOT NULL,
    [rating] FLOAT(53) NOT NULL,
    [quantity] INT NOT NULL,
    [introduction] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdDate] DATETIME2 NOT NULL,
    CONSTRAINT [Food_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Food] ADD CONSTRAINT [Food_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
