import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { Button, Select, TextField } from '@radix-ui/themes'

export default async function Page() {
  const users = await db.user.findMany()

  const cookiesList = cookies()
  const feideAccessToken = cookiesList.get('feideAccessToken')?.value

  if (!feideAccessToken) {
    redirect(
      'https://auth.dataporten.no/oauth/authorization?client_id=f576cc13-6fb6-477b-b407-c2f6e525500b&callback_uri=http://localhost:3000/api/feide/callback&response_type=code',
    )
  }

  const openidUserInfoResponse = await fetch('https://api.dataporten.no/userinfo/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${feideAccessToken}`,
    },
  })

  const openidUserInfo = await openidUserInfoResponse.json()

  async function createCourse(formData: FormData) {
    'use server'
    const formDataEntries = Object.fromEntries(formData.entries())

    // TODO: Fail to create course, id field not unique ??s
    await db.course.create({
      data: {
        name: formDataEntries.name.toString(),
        code: formDataEntries.code.toString(),
        creatorId: formDataEntries.creatorId.toString(),
      },
    })

    revalidatePath('/')
    return redirect('/')
  }

  return (
    <>
      <h1 className="text-lg font-semibold">Create course</h1>

      <form className="flex flex-col gap-2 w-fit" action={createCourse}>
        <label>Course name</label>
        <TextField.Root name="name" required />

        <label>Course code</label>
        <TextField.Root name="code" required />

        <label>Creator</label>
        <p className="text-gray-500">{openidUserInfo.displayName}</p>
        <input type="hidden" name="creatorId" value={openidUserInfo.displayName} />

        {/* <SelectRoot name="creatorId">
          <SelectTrigger placeholder="Select a creator" />
          <SelectContent>
            {users.map((user) => (
              <Select.Item key={user.id} value={user.id.toString()}>
                {user.name}
              </Select.Item>
            ))}
          </SelectContent>
        </SelectRoot> */}

        <Button type="submit">Create course</Button>
      </form>
    </>
  )
}
