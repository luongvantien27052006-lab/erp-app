-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "cccd" TEXT,
    "hometown" TEXT NOT NULL,
    "phone" TEXT,
    "gpa" DOUBLE PRECISION,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'MOI_TAO',
    "saleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
