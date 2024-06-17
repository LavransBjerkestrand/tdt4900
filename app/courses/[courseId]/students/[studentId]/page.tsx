import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { Table } from '@radix-ui/themes'

export default async function Page({ params }: { params: { courseId: string; studentId: string } }) {
  const student = await db.studentUser.findUnique({
    where: {
      id: (params.studentId),
    },
    include: {
      assignmentSubmission: {
        where: {
          assignment: {
            courseId: parseInt(params.courseId),
          },
        },
        include: {
          assignment: {
            include: {
              assignmentTests: true,
            },
          },
          testResults: {
            include: {
              assignmentGradingCondition: true,
            },
          },
        },
      },
    },
  })

  if (!student) {
    redirect(`/courses/${params.courseId}`)
  }

  // console.dir(student, { depth: null })

  return (
    <div>
      <h1 className="text-lg font-semibold">{student.name}</h1>
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.ColumnHeaderCell>Assignment name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Assignment status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Assignment result</Table.ColumnHeaderCell>
          </Table.Row>
          {student.assignmentSubmission.map((submission) => {
            let sumAssignmentTests = 0
            submission.assignment.assignmentTests.map((assignmentTest) => (sumAssignmentTests += assignmentTest.maxPoints))

            let sumAssignmentTestResult = 0
            submission.testResults.map((results) => (sumAssignmentTestResult += results.assignmentGradingCondition.points))
            return (
              <Table.Row key={submission.id}>
                <Table.Cell>{submission.assignment.name}</Table.Cell>
                <Table.Cell>{submission.status}</Table.Cell>
                <Table.Cell>{sumAssignmentTestResult + '/' + sumAssignmentTests}</Table.Cell>
                {/* {submission.assignment.assignmentTests.maxPoints} */}
                {/* {submission.testResults.assignmentGradingCondition.points} */}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
