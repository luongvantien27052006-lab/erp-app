/*
  Warnings:

  - A unique constraint covering the columns `[studentCode]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cccdIssueDate" TIMESTAMP(3),
ADD COLUMN     "cccdIssuePlace" TEXT,
ADD COLUMN     "customerSource" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "enrollmentDate" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "studentCode" TEXT,
ADD COLUMN     "studyStatus" TEXT DEFAULT 'Đang tư vấn';

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentCode_key" ON "Student"("studentCode");
