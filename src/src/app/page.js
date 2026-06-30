import Link from 'next/link'
import { Caravan, Flag, ShipWheel, Percent, Wallet, MapPinned } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { countListings, countDistinctOwners } from '@/lib/db'

const CATEGORY_ICONS = {
  'RVs & campers': Caravan,
  'Golf carts': Flag,
  'ATVs & UTVs': ShipWheel,
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const listingCount = await countListings()
  const ownerCount = await countDistinctOwners()

  return (
    <div>
      <Nav />

      <section className="bg-asphalt px-6 py-14 flex gap-8 items-center flex-wrap">
        <div className="flex-[1.3] min-w-[280px]">
          <p className="font-mono text-[11px] tracking-wider text-orange uppercase mb-3.5">
            Peer-to-peer RV, golf cart &amp; ATV rentals &middot; North Carolina
          </p>
          <h1 className="font-display font-bold text-[36px] leading-tight text-cream mb-3.5">
            List it. Keep 100% of what you earn.
          </h1>
          <p className="text-[15px] leading-relaxed text-border-tan mb-6 max-w-[420px]">
            Most rental platforms take a cut of every booking — some as much
            as a quarter of what you earn. WheelHouse doesn&apos;t. Owners
            keep their full rate. Renters pay one transparent processing fee,
            and that&apos;s our only revenue.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/browse"
              className="bg-orange text-asphalt font-semibold text-sm px-4.5 py-2.5 rounded-md hover:opacity-90"
            >
              Browse rentals
            </Link>
            <Link
              href="/signup"
              className="text-cream text-sm px-4.5 py-2.5 rounded-md border border-white/20 hover:bg-white/5"
            >
              List your RV, cart, or ATV
            </Link>
          </div>
        </div>

        <div className="flex-1 min-w-[260px] flex justify-center">
          <div className="bg-cream rounded-lg p-5 w-full max-w-[300px]">
            <p className="font-mono text-[10px] tracking-wider text-muted uppercase mb-3.5">
              On a $100/day rental
            </p>
            <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-border-tan">
              <p className="text-sm text-muted">Typical platform</p>
              <p className="font-mono text-sm text-muted">owner keeps ~$80</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">WheelHouse</p>
              <p className="font-mono text-base font-medium text-orange">owner keeps $100</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-7 flex flex-wrap">
        <div className="flex-1 min-w-[200px] px-4 border-r border-border-tan flex gap-2.5 items-start">
          <Percent className="text-orange mt-0.5" size={18} />
          <p className="text-[13px]">
            0% commission.
            <br />
            <span className="text-muted">We never take a cut of an owner&apos;s rate.</span>
          </p>
        </div>
        <div className="flex-1 min-w-[200px] px-4 border-r border-border-tan flex gap-2.5 items-start">
          <Wallet className="text-orange mt-0.5" size={18} />
          <p className="text-[13px]">
            One renter fee.
            <br />
            <span className="text-muted">Shown up front, before you request anything.</span>
          </p>
        </div>
        <div className="flex-1 min-w-[200px] px-4 flex gap-2.5 items-start">
          <MapPinned className="text-orange mt-0.5" size={18} />
          <p className="text-[13px]">
            RVs, golf carts &amp; ATVs.
            <br />
            <span className="text-muted">All across North Carolina, starting here.</span>
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 pb-12 pt-3">
        <h2 className="font-display font-bold text-xl mb-1">Browse by category</h2>
        <p className="text-[13px] text-muted mb-6">
          {listingCount > 0
            ? `${listingCount} item${listingCount === 1 ? '' : 's'} listed by ${ownerCount} owner${ownerCount === 1 ? '' : 's'} so far`
            : 'Be the first to list something'}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => (
            <Link
              key={category}
              href={`/browse?category=${encodeURIComponent(category)}`}
              className="bg-white border border-border-tan rounded-lg p-4 flex flex-col items-center gap-2.5 hover:border-steel"
            >
              <Icon className="text-steel" size={24} />
              <p className="text-sm font-medium text-center">{category}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
