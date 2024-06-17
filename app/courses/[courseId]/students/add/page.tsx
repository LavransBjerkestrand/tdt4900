import { db } from '@/lib/db'

import { StudentSearch } from './student-search'

export default async function Page({ params }: { params: { courseId: string } }) {
  const students = await db.studentUser.findMany({
    include: {
      courses: true,
    },
    where: {
      courses: {
        none: {
          id: parseInt(params.courseId),
        },
      },
    },
  })

  async function addStudentsToCourse(studentIds: string[]) {
    'use server'

    const studentsToAdd = students.filter((student) => studentIds.includes(student.id))

    await db.course.update({
      where: {
        id: parseInt(params.courseId),
      },
      data: {
        students: {
          connect: studentIds.map(id => ({id: id}))
        }
      }
    });
  }

  return <StudentSearch students={students} addPromise={addStudentsToCourse} />
}
