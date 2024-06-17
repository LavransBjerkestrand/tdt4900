import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const githubRefreshToken = cookies().get('githubRefreshToken')?.value

  const oauthUrl = new URL('https://github.com/login/oauth/access_token')
  oauthUrl.searchParams.set('client_id', process.env.CLIENT_ID as string)
  oauthUrl.searchParams.set('client_secret', process.env.CLIENT_SECRET as string)
  oauthUrl.searchParams.set('grant_type', 'refresh_token')
  oauthUrl.searchParams.set('refresh_token', githubRefreshToken ?? '')

  const oauthTokenResponse = await fetch(oauthUrl, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  })

  if (!oauthTokenResponse.ok) {
    throw new Error('Failed to get token')
  }

  const oauthTokenBody = await oauthTokenResponse.json()

  const nextUrl = new URL(request.url).searchParams.get('nextUrl')
  const redirectUrl = 'http://localhost:3000' + (nextUrl || '/')

  if ('error' in oauthTokenBody) {
    console.log({ oauthTokenBody })
    const authorizationUrl = new URL('https://github.com/login/oauth/authorize')
    authorizationUrl.searchParams.set('client_id', process.env.CLIENT_ID as string)
    authorizationUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/github/app/callback')

    return NextResponse.redirect(authorizationUrl, { status: 302 })
  }

  const response = NextResponse.redirect(redirectUrl, { status: 302 })
  response.cookies.set('githubAccessToken', oauthTokenBody.access_token, {
    path: '/',
    httpOnly: true,
    maxAge: oauthTokenBody.expires_in,
  })

  return response
}
