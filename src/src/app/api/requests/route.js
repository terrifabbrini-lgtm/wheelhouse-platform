import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getListingById, insertRequest, getUserById } from '@/lib/db'
import { notifyOwnerOfRequest } from '@/lib/notify'

export async function POST(request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'You need to be signed in to request a rental.' }, { status: 401 })
  }

  const { listingId, startDate, endDate, message } = await request.json()
  const listing = await getListingById(listingId)

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })
  }
  if (listing.ownerId === user.id) {
    return NextResponse.json({ error: "You can't request your own listing." }, { status: 400 })
  }
  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start and end dates are required.' }, { status: 400 })
  }

  const req = await insertRequest({ listingId, renterId: user.id, startDate, endDate, message })

  const owner = await getUserById(listing.ownerId)
  if (owner) {
    // Don't let a notification failure block the request from succeeding.
    notifyOwnerOfRequest({
      ownerEmail: owner.email,
      ownerName: owner.name,
      listingTitle: listing.title,
      renterName: user.name,
      startDate,
      endDate,
      message,
    }).catch((err) => console.error('[notify] unexpected error:', err))
  }

  return NextResponse.json({ id: req.id })
}
