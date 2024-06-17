import { cookies } from 'next/headers'
import NextLink from 'next/link'
import { redirect } from 'next/navigation'
import { Octokit } from 'octokit'

import { db } from '@/lib/db'
import { Button, Link, Select, Tabs } from '@radix-ui/themes'

import { uploadSubmission } from './createAssignment'

export default async function Page({ params }: { params: { courseId: string; assignmentId: string } }) {
  const [course, assignment] = await Promise.all([
    db.course.findUnique({
      where: {
        id: parseInt(params.courseId),
      },
    }),
    db.assignment.findUnique({
      where: {
        id: parseInt(params.assignmentId),
      },
    }),
  ])

  if (!course) {
    return <div>Course not found</div>
  }

  if (!assignment) {
    return <div>Assignment not found</div>
  }

  const githubAccessToken = cookies().get('githubAccessToken')?.value

  if (!githubAccessToken) {
    const currentUrl = `/courses/${params.courseId}/assignments/new`
    redirect(`/api/github/auth/refresh-token?nextUrl=${currentUrl}`)
  }

  const octokit = new Octokit({ auth: githubAccessToken })

  const responseRepo = await octokit.request('GET /user/repos', {
    headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    per_page: 100, // TODO: pagination if user has more than 100 repos
  })

  if (!responseRepo) {
    return new Response('Failed to get repo', { status: 500 })
  }

  const repositories = responseRepo.data

  return (
    <>
      <h1>
        Create submissions for {assignment.name} in {course.code}
      </h1>
      <Link asChild>
        <NextLink href={`/courses/${params.courseId}/assignments/${params.assignmentId}`}>Back</NextLink>
      </Link>

      <form className="flex flex-col gap-2 w-fit" action={uploadSubmission}>
        <input type="hidden" name="courseId" value={params.courseId} />
        <input type="hidden" name="assignmentId" value={params.assignmentId} />

        <Tabs.Root defaultValue="upload">
          <Tabs.List>
            <Tabs.Trigger value="upload">Upload file</Tabs.Trigger>
            <Tabs.Trigger value="github">Import Repository</Tabs.Trigger>
          </Tabs.List>

          <div className="my-4">
            <Tabs.Content value="upload">
              <input type="hidden" name="submissionSource" value="upload" />
              <input
                type="file"
                required
                name="submissionZipFile"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text- hover:file:bg-gray-300 hover:cursor-pointer"
              />
            </Tabs.Content>

            <Tabs.Content value="github">
              <input type="hidden" name="submissionSource" value="github" />
              <Select.Root required name="githubRepoInfo">
                <Select.Trigger className="w-full" placeholder="Select repository" />
                <Select.Content>
                  {repositories
                    .sort((a, b) => a.full_name.localeCompare(b.full_name))
                    .map((repositories) => (
                      <Select.Item key={repositories.id} value={`${repositories.full_name},${repositories.default_branch}`}>
                        {repositories.full_name}
                      </Select.Item>
                    ))}
                </Select.Content>
              </Select.Root>
            </Tabs.Content>
          </div>
        </Tabs.Root>

        <Button type="submit">Upload submission</Button>
      </form>
    </>
  )
}
