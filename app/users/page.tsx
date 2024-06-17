import { revalidatePath } from 'next/cache'
import Link from 'next/link'

import { db } from '@/lib/db'
import { Button, Table } from '@radix-ui/themes'

import { DeleteButton } from '../../components/delete-button'

export default async function Page() {
  const users = await db.user.findMany()

  async function deleteUser(id: string) {
    'use server'

    await db.user.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/users')
  }

  return (
    <div className="flex flex-col gap-2 w-fit">
      <h1 className="text-lg font-semibold">Users</h1>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Delete</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map(({ id, name, email }) => (
            <Table.Row key={id}>
              <Table.RowHeaderCell>{name}</Table.RowHeaderCell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                <DeleteButton id={id} deletePromise={deleteUser} title={name} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Link href="/users/new">
        <Button className="w-full" variant="soft">
          Create new user
        </Button>
      </Link>
    </div>
  )
}
