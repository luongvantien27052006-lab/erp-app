-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
