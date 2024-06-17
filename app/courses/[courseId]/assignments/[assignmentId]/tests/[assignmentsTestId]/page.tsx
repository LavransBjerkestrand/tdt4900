type Props = {
  params: {
    assignmentId: string
    assignmentsTestId: string
  }
}

export default async function Page({ params }: Props) {
  return <pre>{JSON.stringify(params, null, 2)}</pre>
}
