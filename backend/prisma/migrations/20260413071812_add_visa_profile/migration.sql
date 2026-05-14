-- CreateTable
CREATE TABLE "VisaProfile" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'MOI_TAO',
    "school" TEXT,
    "intake" TEXT,
    "submittedAt" TIMESTAMP(3),
    "interviewAt" TIMESTAMP(3),
    "result" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisaProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisaProfile" ADD CONSTRAINT "VisaProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
