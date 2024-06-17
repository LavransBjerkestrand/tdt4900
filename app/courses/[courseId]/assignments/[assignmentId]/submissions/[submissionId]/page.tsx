import { db } from '@/lib/db'

type Props = {
  params: {
    assignmentId: string
    submissionId: string
  }
}

export default async function Page({ params }: Props) {
  return <pre>{JSON.stringify(params, null, 2)}</pre>
}
