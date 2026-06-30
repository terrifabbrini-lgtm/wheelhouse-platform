import crypto from 'crypto'
import { cookies } from 'next/headers'
import {
  getUserByEmail,
  insertUser,
  insertSession,
  deleteSession,
  getUserBySessionToken,
} from './db'

const SESSION_COOKIE = 'wh_session'
const SESSION_DAYS = 30

export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
}

export async function createUser({ name, email, phone, password }) {
  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(password, salt)
  return insertUser({ name, email, phone, passwordHash, passwordSalt: salt })
}

export async function findUserByEmail(email) {
  return getUserByEmail(email)
}

export function verifyPassword(user, password) {
  const attempt = hashPassword(password, user.passwordSalt)
  return attempt === user.passwordHash
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  await insertSession(token, userId)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await deleteSession(token)
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const user = await getUserBySessionToken(token)
  if (!user) return null
  return { id: user.id, name: user.name, email: user.email }
}
