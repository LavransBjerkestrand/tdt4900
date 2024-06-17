import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Nav } from '@/components/navbar/nav'
import { db } from '@/lib/db'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TDT4501 - Prosjektoppgave',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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

  const courses = await db.course.findMany()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme className="flex">
          <Nav courses={courses} userInfo={openidUserInfo} className="flex flex-col gap-4 p-8 w-fit max-w-xs" />

          <main className="flex flex-col gap-4 p-8 w-full">{children}</main>
        </Theme>
      </body>
    </html>
  )
}
