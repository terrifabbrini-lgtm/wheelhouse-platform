import Link from 'next/link'
import { Wrench, Tent, Car, PartyPopper, Package, MapPin } from 'lucide-react'
import { priceBreakdown } from '@/lib/pricing'

const CATEGORY_ICONS = {
  'Tools & equipment': Wrench,
  'Outdoor & camping gear': Tent,
  'Vehicles & RVs': Car,
  'Party & event': PartyPopper,
  Other: Package,
}

const CATEGORY_BG = {
  'Tools & equipment': 'bg-steel',
  'Outdoor & camping gear': 'bg-steel-dark',
  'Vehicles & RVs': 'bg-asphalt',
  'Party & event': 'bg-orange',
  Other: 'bg-muted',
}

export default function ListingCard({ listing }) {
  const Icon = CATEGORY_ICONS[listing.category] || Package
  const bg = CATEGORY_BG[listing.category] || 'bg-steel'
  const iconColor = listing.category === 'Party & event' ? 'text-asphalt' : 'text-cream'
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
