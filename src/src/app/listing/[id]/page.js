import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Caravan, Flag, ShipWheel } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RequestForm from '@/components/RequestForm'
import { getListingWithOwner } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { priceBreakdown } from '@/lib/pricing'

const CATEGORY_ICONS = {
  'RVs & campers': Caravan,
  'Golf carts': Flag,
  'ATVs & UTVs': ShipWheel,
}
const CATEGORY_BG = {
  'RVs & campers': 'bg-steel',
  'Golf carts': 'bg-orange',
  'ATVs & UTVs': 'bg-asphalt',
}

export default async function ListingDetail({ params }) {
  const { id } = await params
  const listing = await getListingWithOwner(id)
  if (!listing) notFound()

  const user = await getCurrentUser()
  const { renterPaysPerDay } = priceBreakdown(listing.pricePerDay)
  const Icon = CATEGORY_ICONS[listing.category] || Caravan
  const bg = CATEGORY_BG[listing.category] || 'bg-steel'
  const iconColor = listing.category === 'Golf carts' ? 'text-asphalt' : 'text-cream'

  return (
    <div>
      <Nav />

      <section className="bg-cream px-6 pt-6 pb-10">
        <Link href="/browse" className="text-sm text-muted flex items-center gap-1 mb-6">
          <ArrowLeft size={14} /> Back to browse
        </Link>

        <div className={`${bg} h-[200px] rounded-md flex items-center justify-center mb-6`}>
          <Icon className={iconColor} size={48} />
        </div>

        <div className="flex gap-7 flex-wrap">
          <div className="flex-[1.4] min-w-[260px]">
            <p className="font-mono text-[10px] tracking-wider text-muted uppercase mb-1.5">
              {listing.category}
            </p>
            <h1 className="font-display font-bold text-[22px] mb-1.5">{listing.title}</h1>
            <p className="text-[13px] text-muted mb-4.5 flex items-center gap-1">
              <MapPin size={14} /> {listing.location}
            </p>

            <p className="text-sm leading-relaxed mb-4.5">{listing.description}</p>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-steel text-cream flex items-center justify-center text-xs font-medium">
                {listing.ownerName
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <p className="text-sm">Listed by {listing.ownerName}</p>
            </div>
          </div>

          <div className="flex-1 min-w-[240px]">
            <div className="bg-white border border-border-tan rounded-lg p-5">
              <p className="font-mono text-[26px] mb-1">
                ${renterPaysPerDay.toFixed(2)}
                <span className="font-sans text-[13px] text-muted">/day</span>
              </p>
              <p className="text-xs text-muted mb-5">
                Includes a small WheelHouse fee &mdash; your host keeps 100% of their rate
              </p>

              <RequestForm
                listingId={listing.id}
                isOwner={user?.id === listing.ownerId}
                isLoggedIn={!!user}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
