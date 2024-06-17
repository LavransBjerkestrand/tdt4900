import { NextResponse } from 'next/server'
import { Octokit } from 'octokit'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  // const installation_id = url.searchParams.get('installation_id')
  // const setup_action = url.searchParams.get('install')

  if (!code) {
    return new Response('Missing code', { status: 400 })
  }

  const oauthUrl = new URL('https://github.com/login/oauth/access_token')
  oauthUrl.searchParams.set('code', code)
  oauthUrl.searchParams.set('client_id', process.env.CLIENT_ID as string)
  oauthUrl.searchParams.set('client_secret', process.env.CLIENT_SECRET as string)

  const oauthTokenResponse = await fetch(oauthUrl, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  })
  if (!oauthTokenResponse.ok) {
    return new Response('Failed to get token', { status: 500 })
  }

  const oauthTokenBody = await oauthTokenResponse.json()
  console.log({ oauthTokenBody })

  if ('error' in oauthTokenBody) {
    return new Response('Failed to get token', { status: 500 })
  }

  const accessToken = oauthTokenBody.access_token
  const refreshToken = oauthTokenBody.refresh_token

  const octokit = new Octokit({
    auth: accessToken,
  })

  const responseRepo = await octokit.request('GET /user/repos', {
    headers: { 'X-GitHub-Api-Version': '2022-11-28' },
  })

  if (!responseRepo) {
    return new Response('Failed to get repo', { status: 500 })
  }

  const response = NextResponse.redirect('http://localhost:3000', { status: 302 })
  response.cookies.set('githubAccessToken', accessToken, {
    path: '/',
    httpOnly: true,
    maxAge: oauthTokenBody.expires_in,
  })

  response.cookies.set('githubRefreshToken', refreshToken, {
    path: '/',
    httpOnly: true,
    maxAge: oauthTokenBody.refresh_token_expires_in,
  })

  return response
}
