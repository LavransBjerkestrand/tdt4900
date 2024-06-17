-- CreateEnum
CREATE TYPE "SUBMISSION_STATUS" AS ENUM ('PENDING', 'RUNNING', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "StudentUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "graderZipFile" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentTest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentTestCondition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expectedOutputRegEx" TEXT NOT NULL,
    "assignmentTestId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentTestCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" SERIAL NOT NULL,
    "status" "SUBMISSION_STATUS" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionZipFile" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "studentUserId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmissionTestResult" (
    "id" SERIAL NOT NULL,
    "output" TEXT NOT NULL,
    "assignmentSubmissionId" INTEGER NOT NULL,
    "assignmentGradingConditionId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentSubmissionTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToStudentUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToStudentUser_AB_unique" ON "_CourseToStudentUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToStudentUser_B_index" ON "_CourseToStudentUser"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentTest" ADD CONSTRAINT "AssignmentTest_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentTestCondition" ADD CONSTRAINT "AssignmentTestCondition_assignmentTestId_fkey" FOREIGN KEY ("assignmentTestId") REFERENCES "AssignmentTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "StudentUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmissionTestResult" ADD CONSTRAINT "AssignmentSubmissionTestResult_assignmentSubmissionId_fkey" FOREIGN KEY ("assignmentSubmissionId") REFERENCES "AssignmentSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmissionTestResult" ADD CONSTRAINT "AssignmentSubmissionTestResult_assignmentGradingConditionI_fkey" FOREIGN KEY ("assignmentGradingConditionId") REFERENCES "AssignmentTestCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudentUser" ADD CONSTRAINT "_CourseToStudentUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudentUser" ADD CONSTRAINT "_CourseToStudentUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
