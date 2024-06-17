'use client'

import { useState } from 'react'
import { HiMagnifyingGlassCircle } from 'react-icons/hi2'

import { Course, StudentUser } from '@prisma/client'
import { Button, Checkbox, Table, TextField } from '@radix-ui/themes'

export function StudentSearch({
  students,
  addPromise,
}: {
  students: (StudentUser & { courses: Course[] })[];
  addPromise: (array: string[]) => Promise<void>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function addStudents(checked: any, id: any) {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((a) => a !== id))
    }
  }

  return (
    <div className="grid gap-4">
      <TextField.Root
        name="searchField"
        placeholder="Search for students"
        onChange={(e) => setSearchValue(e.currentTarget.value)}
      >
        <TextField.Slot>
          <HiMagnifyingGlassCircle height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell />
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students
            .filter((student) => student.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map(({ id, name, email }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <Checkbox
                    checked={selectedIds.some((a) => a === id)}
                    onCheckedChange={(isChecked) => addStudents(isChecked, id)}
                  />
                </Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      <Button onClick={async () => await addPromise(selectedIds)}>Add students to course</Button>
    </div>
  )
}
