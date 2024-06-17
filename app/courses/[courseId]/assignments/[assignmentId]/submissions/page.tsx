import { db } from '@/lib/db'

export default async function Page({ params }: { params: { assignmentId: string } }) {
  const submissions = await db.assignmentSubmission.findMany({
    where: {
      assignmentId: parseInt(params.assignmentId),
    },
  })

  return <pre>{JSON.stringify({ params, submissions }, null, 2)}</pre>
}
