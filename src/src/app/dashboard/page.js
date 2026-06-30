import Link from 'next/link'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RequestActions from '@/components/RequestActions'
import { getListingsByOwner, getIncomingRequestsForOwner, getRequestsByRenter } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { priceBreakdown } from '@/lib/pricing'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  accepted: 'bg-green-50 text-green-800 border-green-200',
  declined: 'bg-red-50 text-red-800 border-red-200',
}

export default async function Dashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const myListings = await getListingsByOwner(user.id)
  const incomingRequests = await getIncomingRequestsForOwner(user.id)
  const myRequests = await getRequestsByRenter(user.id)

  return (
    <div>
      <Nav />

      <section className="bg-cream px-6 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-2xl mb-1">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-sm text-muted mb-8">Manage your listings and rental requests.</p>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">Your listings</h2>
          <Link href="/list-equipment" className="text-sm text-steel font-medium">
            + List a new rental
          </Link>
        </div>
        {myListings.length === 0 ? (
          <p className="text-sm text-muted mb-8">
            You haven&apos;t listed anything yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {myListings.map((l) => (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                className="bg-white border border-border-tan rounded-lg p-4 hover:border-steel"
              >
                <p className="font-display font-bold text-sm mb-1">{l.title}</p>
                <p className="text-xs text-muted mb-2">{l.category} &middot; {l.location}</p>
                <p className="font-mono text-sm">${l.pricePerDay.toFixed(0)}/day</p>
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-display font-bold text-lg mb-3">Requests on your listings</h2>
        {incomingRequests.length === 0 ? (
          <p className="text-sm text-muted mb-8">No rental requests yet.</p>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            {incomingRequests.map((r) => {
              const { renterPaysPerDay } = priceBreakdown(r.pricePerDay)
              return (
                <div key={r.id} className="bg-white border border-border-tan rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-medium mb-0.5">{r.listingTitle}</p>
                      <p className="text-xs text-muted mb-1.5">
                        {r.renterName} &middot; {r.renterEmail}
                        {r.renterPhone && <> &middot; {r.renterPhone}</>}
                      </p>
                      <p className="text-xs text-muted mb-1.5">
                        {r.startDate} &rarr; {r.endDate} &middot; ${renterPaysPerDay.toFixed(2)}/day, all in
                      </p>
                      {r.message && <p className="text-xs italic text-muted">&ldquo;{r.message}&rdquo;</p>}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md border ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.status === 'pending' && (
                    <div className="mt-3">
                      <RequestActions requestId={r.id} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <h2 className="font-display font-bold text-lg mb-3">Your requests as a renter</h2>
        {myRequests.length === 0 ? (
          <p className="text-sm text-muted">You haven&apos;t requested anything yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {myRequests.map((r) => (
              <div key={r.id} className="bg-white border border-border-tan rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium mb-0.5">{r.listingTitle}</p>
                  <p className="text-xs text-muted">
                    From {r.ownerName} &middot; {r.startDate} &rarr; {r.endDate}
                    {r.status === 'accepted' && r.ownerPhone && <> &middot; {r.ownerPhone}</>}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md border ${STATUS_STYLES[r.status]}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
