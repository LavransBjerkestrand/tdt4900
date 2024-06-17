'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { messageQueueChannel } from '@/workers/messageQueue'
import { storageClient } from '@/workers/storageClient'

export async function createAssignment(formData: FormData) {
  const courseId = formData.get('courseId')?.toString()
  const submissionSource = formData.get('submissionSource')?.toString()

  if (!courseId || !submissionSource) {
    throw new Error('Missing courseId or submissionSource')
  }

  if (submissionSource === 'github') {
    const githubRepoInfo = formData.get('githubRepoInfo')?.toString()
    if (!githubRepoInfo) {
      throw new Error('Missing github repo id')
    }

    const githubAccessToken = cookies().get('githubAccessToken')?.value
    if (!githubAccessToken) {
      throw new Error('Missing github access token')
    }

    // TODO: download repo using git tree api if repo is larger than 1000 files
    const [repositoryFullName, defaultBranch] = githubRepoInfo.split(',')
    const [owner, repo] = repositoryFullName.split('/')
    console.log({ owner, repo, defaultBranch })

    const repositoryResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubAccessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    if (repositoryResponse.status !== 200) {
      throw new Error('Failed to GET repository')
    }

    // send zipDownloadUrl to message queue so it can be downloaded and processed asynchronously
    messageQueueChannel.sendToQueue('uploads.grader.github.q', {
      repositoryFullName,
      zipDownloadUrl: repositoryResponse.url,
    })
  } else if (submissionSource === 'upload') {
    // last opp filen til filserveren
    const graderZipFile = formData.get('graderZipFile') as File
    const graderZipFileBuffer = Buffer.from(await graderZipFile.arrayBuffer())

    await storageClient.putObject(
      process.env.BUCKET_NAME_GRADERS as string,
      graderZipFile.name,
      graderZipFileBuffer,
      graderZipFile.size,
      { 'Content-Type': graderZipFile.type },
    )

    const assignment = await db.assignment.create({
      data: {
        courseId: parseInt(courseId),
        name: formData.get('name')?.toString() ?? '',
        releaseDate: new Date(formData.get('releaFseDate')?.toString() ?? ''),
        dueDate: new Date(formData.get('dueDate')?.toString() ?? ''),
        graderZipFile: graderZipFile.name,
      },
    })

    return redirect(`/courses/${courseId}/assignments/${assignment.id}`)
  } else {
    throw new Error('Invalid submission source')
  }
}
