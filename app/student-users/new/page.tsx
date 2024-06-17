import { revalidatePath } from 'next/cache'
import NextLink from 'next/link'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { Button, Link, TextField } from '@radix-ui/themes'

export default async function Page() {
  async function createStudentUser(formData: FormData) {
    'use server'
    const formDataEntries = Object.fromEntries(formData.entries())

    await db.studentUser.create({
      data: {
        id: crypto.randomUUID(),
        name: formDataEntries.name.toString(),
        email: formDataEntries.email.toString(),
      },
    })

    revalidatePath('/')
    return redirect('/student-users')
  }

  return (
    <>
      <h1 className="text-lg font-semibold">Create student user</h1>
      <Link asChild>
        <NextLink href="/student-users">Back</NextLink>
      </Link>

      <form className="flex flex-col gap-2 w-fit" action={createStudentUser}>
        <label>Name</label>
        <TextField.Root name="name" required />

        <label>E-mail</label>
        <TextField.Root name="email" required type="email" />

        <Button>Create student user</Button>
      </form>
    </>
  )
}
