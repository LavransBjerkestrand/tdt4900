import { revalidatePath } from 'next/cache'
import Link from 'next/link'

import { DeleteButton } from '@/components/delete-button'
import { db } from '@/lib/db'
import { Button, Table } from '@radix-ui/themes'

export default async function Page() {
  const studentUsers = await db.studentUser.findMany()

  async function deleteStudent(id: string) {
    'use server'

    await db.studentUser.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/users')
  }

  return (
    <div className="flex flex-col gap-2 w-fit">
      <h1 className="text-lg font-semibold">Students</h1>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Delete</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {studentUsers.map(({ id, name, email }) => (
            <Table.Row key={id}>
              <Table.RowHeaderCell>{name}</Table.RowHeaderCell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                <DeleteButton id={id} deletePromise={deleteStudent} title={name} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Link href="/student-users/new">
        <Button className="w-full" variant="soft">
          Create new student user
        </Button>
      </Link>
    </div>
  )
}
