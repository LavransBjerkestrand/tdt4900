/*
  Warnings:

  - The primary key for the `StudentUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_studentUserId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToStudentUser" DROP CONSTRAINT "_CourseToStudentUser_B_fkey";

-- AlterTable
ALTER TABLE "AssignmentSubmission" ALTER COLUMN "studentUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudentUser" DROP CONSTRAINT "StudentUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentUser_id_seq";

-- AlterTable
ALTER TABLE "_CourseToStudentUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "StudentUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudentUser" ADD CONSTRAINT "_CourseToStudentUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
