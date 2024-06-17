import NextLink from 'next/link'

import { TableLinkCell_ } from '@/components/table-link-cell'
import { db } from '@/lib/db'
import { Button, Table, Tabs } from '@radix-ui/themes'

export default async function Layout({ children, params }: { children: React.ReactNode; params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: {
      id: parseInt(params.courseId),
    },
    include: {
      assignments: true,
      creator: true,
      students: true,
    },
  })

  if (course === null) {
    return <div>Course not found</div>
  }

  return (
    <div className="flex items-start gap-8">
      <div>
        <h1 className="text-lg font-semibold">{course.name}</h1>
        <p>
          {course.creator.name} {`<${course.creator.email}>`}
        </p>

        <Tabs.Root defaultValue="assignments">
          <Tabs.List>
            <Tabs.Trigger value="assignments">Assignments</Tabs.Trigger>
            <Tabs.Trigger value="students">Students</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>

          <div className="mt-4">
            <Tabs.Content value="assignments" className="grid gap-4">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Release date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Due date</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {course.assignments
                    .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime())
                    .map((assignment) => {
                      const href = `/courses/${course.id}/assignments/${assignment.id}`

                      return (
                        <Table.Row key={assignment.id} className="hover:bg-gray-200">
                          <TableLinkCell_ href={href}>{assignment.name}</TableLinkCell_>
                          <TableLinkCell_ href={href}>{assignment.releaseDate.toDateString()}</TableLinkCell_>
                          <TableLinkCell_ href={href}>{assignment.dueDate.toDateString()}</TableLinkCell_>
                        </Table.Row>
                      )
                    })}
                </Table.Body>
              </Table.Root>

              <NextLink href={`/courses/${params.courseId}/assignments/new`}>
                <Button className="w-full">Create assignment</Button>
              </NextLink>
            </Tabs.Content>

            <Tabs.Content value="students" className="grid gap-4">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {course.students.map(({ id, name, email }) => {
                    const href = `/courses/${course.id}/students/${id}`

                    return (
                      <Table.Row key={id} className="hover:bg-gray-200">
                        <TableLinkCell_ href={href}>{name}</TableLinkCell_>
                        <TableLinkCell_ href={href}>{email}</TableLinkCell_>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>

              <Button>
                <NextLink href={`/courses/${params.courseId}/students/add`}>Add student</NextLink>
              </Button>
            </Tabs.Content>

            <Tabs.Content value="settings">Settings...</Tabs.Content>
          </div>
        </Tabs.Root>
      </div>

      <div>{children}</div>
    </div>
  )
}
