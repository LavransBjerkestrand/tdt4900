import { NextResponse } from 'next/server'

export function GET(_request: Request) {
  const response = NextResponse.redirect('http://localhost:3000', { status: 302 })
  response.cookies.delete('feideAccessToken')

  return response
}
