'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Course } from '@prisma/client'
import { Button } from '@radix-ui/themes'

const CLIENT_ID = 'f576cc13-6fb6-477b-b407-c2f6e525500b'
const CALLBACK_URI = 'http://localhost:3000/api/feide/callback'
// const CALLBACK_URI_LOGOUT = 'http://localhost:3000/api/feide/logout'
const RESPONSE_TYPE = 'code'

type Props = {
  courses: Course[]
  className?: string
  userInfo: Record<string, any>
  onButtonClick?: () => void
}

export function Nav({ courses, className, userInfo, onButtonClick }: Props) {
  const pathname = usePathname()
  const courseId = parseInt(pathname.split('/')[2])

  return (
    <nav className={className} style={{ backgroundColor: 'white', height: '100%' }}>
      <h1 className="text-lg font-semibold">Courses</h1>

      <div className="grid auto-rows-fr gap-4 items-stretch">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <Button variant={course.id === courseId ? 'solid' : 'soft'} className="w-full !h-full !py-2 !text-center" onClick={onButtonClick}>
              {course.code} {course.name}
            </Button>
          </Link>
        ))}
      </div>

      <Link href="/courses/new">
        <Button className="w-full" variant="soft" onClick={onButtonClick}>
          Create new course
        </Button>
      </Link>

      <h1 className="text-lg font-semibold">Users</h1>
      <Link href="/users">
        <Button className="w-full" variant={pathname.includes('/users') ? 'solid' : 'soft'} onClick={onButtonClick}>
          All users
        </Button>
      </Link>

      <h1 className="text-lg font-semibold">Student users</h1>
      <Link href="/student-users">
        <Button className="w-full" variant={pathname.includes('/student-users') ? 'solid' : 'soft'} onClick={onButtonClick}>
          All student users
        </Button>
      </Link>
      <div
        style={{
          position: 'fixed',
          bottom: '2%',
        }}
      >
        <div>
          <p>{userInfo.displayName}</p>
          <p className="text-gray-500">{userInfo.eduPersonPrincipalName}</p>
        </div>

        <div className="grid gap-2">
          <form method="GET" action="https://auth.dataporten.no/oauth/authorization">
            <input type="hidden" name="client_id" value={CLIENT_ID} />
            <input type="hidden" name="callback_uri" value={CALLBACK_URI} />
            <input type="hidden" name="response_type" value={RESPONSE_TYPE} />
            <Button type="submit" className="w-full">
              Login with Feide
            </Button>
          </form>

          {/* <form method="GET" action="https://auth.dataporten.no/openid/endsession">
          <input type="hidden" name="id_token_hint" value={idToken} />
          <input type="hidden" name="post_logout_redirect_uri" value={CALLBACK_URI_LOGOUT} /> */}
          <form method="GET" action="/api/feide/logout">
            <Button type="submit" className="w-full" color="red" variant="soft">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
