// Real Postgres-backed data layer (node-postgres). Reads connection info
// from DATABASE_URL — Render (or Railway/Supabase/etc.) injects this
// automatically once you attach a Postgres database to this service.
// For local development without a database, see README for a quick
// local-Postgres setup; there's no file-based fallback anymore.
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
})

let schemaReady = null
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT DEFAULT '',
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users (id),
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        price_per_day NUMERIC NOT NULL,
        location TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES listings (id),
        renter_id INTEGER NOT NULL REFERENCES users (id),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        message TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)
  }
  return schemaReady
}

function userRow(r) {
  if (!r) return null
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || '',
    passwordHash: r.password_hash,
    passwordSalt: r.password_salt,
    createdAt: r.created_at,
  }
}

function listingRow(r) {
  if (!r) return null
  return {
    id: r.id,
    ownerId: r.owner_id,
    title: r.title,
    category: r.category,
    description: r.description,
    pricePerDay: Number(r.price_per_day),
    location: r.location,
    createdAt: r.created_at,
  }
}

function requestRow(r) {
  if (!r) return null
  return {
    id: r.id,
    listingId: r.listing_id,
    renterId: r.renter_id,
    startDate: r.start_date,
    endDate: r.end_date,
    message: r.message || '',
    status: r.status,
    createdAt: r.created_at,
  }
}

// --- users ---
export async function getUserByEmail(email) {
  await ensureSchema()
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()])
  return userRow(rows[0])
}

export async function getUserById(id) {
  await ensureSchema()
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [Number(id)])
  return userRow(rows[0])
}

export async function insertUser({ name, email, phone, passwordHash, passwordSalt }) {
  await ensureSchema()
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, password_salt)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email.toLowerCase().trim(), phone || '', passwordHash, passwordSalt]
  )
  return userRow(rows[0])
}

// --- sessions ---
export async function insertSession(token, userId) {
  await ensureSchema()
  await pool.query('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, userId])
}

export async function deleteSession(token) {
  await ensureSchema()
  await pool.query('DELETE FROM sessions WHERE token = $1', [token])
}

export async function getUserBySessionToken(token) {
  await ensureSchema()
  const { rows } = await pool.query(
    `SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = $1`,
    [token]
  )
  return userRow(rows[0])
}

// --- listings ---
export async function insertListing({ ownerId, title, category, description, pricePerDay, location }) {
  await ensureSchema()
  const { rows } = await pool.query(
    `INSERT INTO listings (owner_id, title, category, description, price_per_day, location)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [ownerId, title, category, description, pricePerDay, location]
  )
  return listingRow(rows[0])
}

export async function getListingById(id) {
  await ensureSchema()
  const { rows } = await pool.query('SELECT * FROM listings WHERE id = $1', [Number(id)])
  return listingRow(rows[0])
}

export async function getListingWithOwner(id) {
  await ensureSchema()
  const { rows } = await pool.query(
    `SELECT listings.*, users.name AS owner_name FROM listings
     JOIN users ON users.id = listings.owner_id WHERE listings.id = $1`,
    [Number(id)]
  )
  if (!rows[0]) return null
  return { ...listingRow(rows[0]), ownerName: rows[0].owner_name }
}

export async function getListings({ category, location } = {}) {
  await ensureSchema()
  const conditions = []
  const params = []
  if (category && category !== 'all') {
    params.push(category)
    conditions.push(`category = $${params.length}`)
  }
  if (location && location.trim()) {
    params.push(`%${location.trim()}%`)
    conditions.push(`location ILIKE $${params.length}`)
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT * FROM listings ${where} ORDER BY created_at DESC`,
    params
  )
  return rows.map(listingRow)
}

export async function getListingsByOwner(ownerId) {
  await ensureSchema()
  const { rows } = await pool.query(
    'SELECT * FROM listings WHERE owner_id = $1 ORDER BY created_at DESC',
    [ownerId]
  )
  return rows.map(listingRow)
}

export async function countListings() {
  await ensureSchema()
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM listings')
  return rows[0].count
}

export async function countDistinctOwners() {
  await ensureSchema()
  const { rows } = await pool.query('SELECT COUNT(DISTINCT owner_id)::int AS count FROM listings')
  return rows[0].count
}

// --- requests ---
export async function insertRequest({ listingId, renterId, startDate, endDate, message }) {
  await ensureSchema()
  const { rows } = await pool.query(
    `INSERT INTO requests (listing_id, renter_id, start_date, end_date, message)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [Number(listingId), renterId, startDate, endDate, message || '']
  )
  return requestRow(rows[0])
}

export async function getRequestById(id) {
  await ensureSchema()
  const { rows } = await pool.query('SELECT * FROM requests WHERE id = $1', [Number(id)])
  return requestRow(rows[0])
}

export async function updateRequestStatus(id, status) {
  await ensureSchema()
  const { rows } = await pool.query(
    'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
    [status, Number(id)]
  )
  return requestRow(rows[0])
}

export async function getIncomingRequestsForOwner(ownerId) {
  await ensureSchema()
  const { rows } = await pool.query(
    `SELECT requests.*, listings.title AS listing_title, listings.price_per_day,
            users.name AS renter_name, users.email AS renter_email, users.phone AS renter_phone
     FROM requests
     JOIN listings ON listings.id = requests.listing_id
     JOIN users ON users.id = requests.renter_id
     WHERE listings.owner_id = $1
     ORDER BY requests.created_at DESC`,
    [ownerId]
  )
  return rows.map((r) => ({
    ...requestRow(r),
    listingTitle: r.listing_title,
    pricePerDay: Number(r.price_per_day),
    renterName: r.renter_name,
    renterEmail: r.renter_email,
    renterPhone: r.renter_phone || '',
  }))
}

export async function getRequestsByRenter(renterId) {
  await ensureSchema()
  const { rows } = await pool.query(
    `SELECT requests.*, listings.title AS listing_title,
            users.name AS owner_name, users.phone AS owner_phone
     FROM requests
     JOIN listings ON listings.id = requests.listing_id
     JOIN users ON users.id = listings.owner_id
     WHERE requests.renter_id = $1
     ORDER BY requests.created_at DESC`,
    [renterId]
  )
  return rows.map((r) => ({
    ...requestRow(r),
    listingTitle: r.listing_title,
    ownerName: r.owner_name,
    ownerPhone: r.owner_phone || '',
  }))
}
