import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { insertListing } from '@/lib/db'
import { CATEGORIES } from '@/lib/categories'

export async function POST(request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'You need to be signed in to list equipment.' }, { status: 401 })
  }

  const { title, category, description, pricePerDay, location } = await request.json()

  if (!title?.trim() || !description?.trim() || !location?.trim()) {
    return NextResponse.json({ error: 'Title, description, and location are required.' }, { status: 400 })
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Choose a valid category.' }, { status: 400 })
  }
  const price = Number(pricePerDay)
  if (!price || price <= 0) {
    return NextResponse.json({ error: 'Price per day must be a positive number.' }, { status: 400 })
  }

  const listing = await insertListing({
    ownerId: user.id,
    title: title.trim(),
    category,
    description: description.trim(),
    pricePerDay: price,
    location: location.trim(),
  })

  return NextResponse.json({ id: listing.id })
}
