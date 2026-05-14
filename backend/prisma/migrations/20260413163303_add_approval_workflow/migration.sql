-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" INTEGER;
