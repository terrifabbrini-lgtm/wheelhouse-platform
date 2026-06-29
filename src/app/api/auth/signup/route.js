import { NextResponse } from 'next/server'
import { createUser, findUserByEmail, createSession } from '@/lib/auth'

export async function POST(request) {
  const { name, email, phone, password } = await request.json()

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Name, email, and password are all required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }
  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 })
  }

  const user = await createUser({ name: name.trim(), email, phone: phone?.trim(), password })
  await createSession(user.id)

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}
