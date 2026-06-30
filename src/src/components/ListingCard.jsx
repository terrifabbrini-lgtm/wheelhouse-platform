import Link from 'next/link'
import { Caravan, Flag, ShipWheel, MapPin } from 'lucide-react'
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

export default function ListingCard({ listing }) {
  const Icon = CATEGORY_ICONS[listing.category] || Caravan
  const bg = CATEGORY_BG[listing.category] || 'bg-steel'
  const iconColor = listing.category === 'Golf carts' ? 'text-asphalt' : 'text-cream'
  const { renterPaysPerDay } = priceBreakdown(listing.pricePerDay)

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block bg-white border border-border-tan rounded-lg overflow-hidden hover:border-steel"
    >
      <div className={`${bg} h-[100px] flex items-center justify-center`}>
        <Icon className={iconColor} size={30} />
      </div>
      <div className="p-3.5">
        <p className="font-display font-bold text-sm mb-1 truncate">{listing.title}</p>
        <p className="text-xs text-muted mb-2.5 flex items-center gap-1">
          <MapPin size={12} /> {listing.location}
        </p>
        <p className="font-mono text-[15px]">
          ${renterPaysPerDay.toFixed(0)}
          <span className="font-sans text-[11px] text-muted">/day, all in</span>
        </p>
      </div>
    </Link>
  )
}
