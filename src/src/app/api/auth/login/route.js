import { NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword, createSession } from '@/lib/auth'

export async function POST(request) {
  const { email, password } = await request.json()

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const user = await findUserByEmail(email)
  if (!user || !verifyPassword(user, password)) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  await createSession(user.id)
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}
