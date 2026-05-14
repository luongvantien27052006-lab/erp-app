-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DA_THANH_TOAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
