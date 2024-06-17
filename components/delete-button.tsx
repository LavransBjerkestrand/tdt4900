'use client'

import { HiTrash } from 'react-icons/hi2'

import { AlertDialog, Button, Flex } from '@radix-ui/themes'

export function DeleteButton({
  id,
  deletePromise,
  title,
}: {
  id: string;
  deletePromise: (id: string) => Promise<void>;
  title: string;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="soft" color="red">
          <HiTrash />
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className="!max-w-[24rem]">
        <AlertDialog.Title>Delete {title}</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure? You are about to delete {title}.</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={async () => await deletePromise(id)}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
