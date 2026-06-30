import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getRequestById, getListingById, updateRequestStatus } from '@/lib/db'

export async function PATCH(request, { params }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'You need to be signed in.' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()
  if (!['accepted', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Status must be accepted or declined.' }, { status: 400 })
  }

  const req = await getRequestById(id)
  if (!req) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }
  const listing = await getListingById(req.listingId)
  if (!listing || listing.ownerId !== user.id) {
    return NextResponse.json({ error: 'Only the equipment owner can respond to this request.' }, { status: 403 })
  }

  await updateRequestStatus(id, status)
  return NextResponse.json({ ok: true })
}
