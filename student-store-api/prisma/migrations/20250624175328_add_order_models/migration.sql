-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);
