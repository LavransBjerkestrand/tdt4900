import Link from 'next/link'

import { TableLinkCell_ } from '@/components/table-link-cell'
import { db } from '@/lib/db'
import { Button, Table, Tabs } from '@radix-ui/themes'

export default async function Page({ params }: { params: { courseId: string; assignmentId: string } }) {
  const assignment = await db.assignment.findUnique({
    where: {
      courseId: parseInt(params.courseId),
      id: parseInt(params.assignmentId),
    },
    include: {
      assignmentSubmission: true,
      assignmentTests: true,
    },
  })

  if (assignment === null) {
    return <div>Assignment not found</div>
  }

  return (
    <>
      <h1 className="text-lg font-semibold">{assignment.name}</h1>
      <br />

      <Tabs.Root defaultValue="tests">
        <Tabs.List>
          <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
          <Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-4">
          <Tabs.Content value="tests" className="grid gap-4">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Max points</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {assignment.assignmentTests.map((test) => {
                  const href = `/courses/${test.id}/assignments/${test.id}`

                  return (
                    <Table.Row key={test.id} className="hover:bg-gray-200">
                      <TableLinkCell_ href={href}>{test.name}</TableLinkCell_>
                      <TableLinkCell_ href={href}>{test.maxPoints}</TableLinkCell_>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </Tabs.Content>

          <Tabs.Content value="submissions" className="grid gap-4">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Student</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Submitted at</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {assignment.assignmentSubmission.map((submission) => {
                  const href = `/courses/${submission.id}/assignments/${submission.id}`

                  return (
                    <Table.Row key={submission.id} className="hover:bg-gray-200">
                      <TableLinkCell_ href={href}>{submission.studentUserId}</TableLinkCell_>
                      <TableLinkCell_ href={href}>{submission.createdAt.toDateString()}</TableLinkCell_>
                      <TableLinkCell_ href={href}>{submission.status}</TableLinkCell_>
                      <TableLinkCell_ href={href}>
                        {submission.status === 'FINISHED' && `${Math.floor(Math.random() * 100)}/100`}
                      </TableLinkCell_>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
            <Link href={`/courses/${params.courseId}/assignments/${params.assignmentId}/submissions/new`}>
              <Button>Create submission</Button>
            </Link>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </>
  )
}
