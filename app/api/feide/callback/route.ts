import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code', { status: 400 })
  }

  const CLIENT_ID = 'f576cc13-6fb6-477b-b407-c2f6e525500b'
  const CLIENT_SECRET = 'bf52c699-73cd-4c98-876b-3269a887d06d'

  const oauthTokenResponse = await fetch('https://auth.dataporten.no/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:3000/api/feide/callback',
      client_id: 'f576cc13-6fb6-477b-b407-c2f6e525500b',
    }),
  })

  const oauthTokenBody = await oauthTokenResponse.json()
  const oauthTokenExpiresIn = oauthTokenBody.expires_in
  const oauthToken = oauthTokenBody.access_token

  const userInfoResponse = await fetch('https://auth.dataporten.no/userinfo', {
    headers: {
      Authorization: `Bearer ${oauthToken}`,
    },
  })

  const userInfo = await userInfoResponse.json()
  console.log(userInfo)

  // const openidUserInfoResponse = await fetch('https://auth.dataporten.no/openid/userinfo', {
  //   headers: {
  //     Authorization: `Bearer ${oauthToken}`,
  //   },
  // })

  // const openidUserInfo = await openidUserInfoResponse.json()

  const response = NextResponse.redirect('http://localhost:3000', { status: 302 })
  response.cookies.set('feideAccessToken', oauthToken, {
    path: '/',
    httpOnly: true,
    maxAge: oauthTokenExpiresIn,
  })

  return response
}
