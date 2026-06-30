import Link from 'next/link'
import { MapPin } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import { getListings } from '@/lib/db'
import { CATEGORIES } from '@/lib/categories'

export default async function Browse({ searchParams }) {
  const params = await searchParams
  const category = params?.category || 'all'
  const location = params?.location || ''

  const listings = await getListings({ category, location })

  return (
    <div>
      <Nav />

      <section className="bg-cream px-6 pt-6 pb-4">
        <div className="flex gap-2.5 mb-4 flex-wrap">
          <Link
            href="/browse"
            className={`text-sm px-4 py-2 rounded-full ${
              category === 'all' ? 'bg-asphalt text-cream' : 'border border-steel'
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/browse?category=${encodeURIComponent(c)}${location ? `&location=${encodeURIComponent(location)}` : ''}`}
              className={`text-sm px-4 py-2 rounded-full ${
                category === c ? 'bg-asphalt text-cream' : 'border border-steel'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <form className="flex gap-2.5 bg-white border border-border-tan rounded-md px-3 py-2 items-center max-w-[380px]" action="/browse">
          {category !== 'all' && <input type="hidden" name="category" value={category} />}
          <MapPin size={16} className="text-muted" />
          <input
            type="text"
            name="location"
            defaultValue={location}
            placeholder="City or zip in North Carolina"
            className="border-none outline-none text-sm flex-1 bg-transparent"
          />
          <button type="submit" className="bg-asphalt text-cream text-xs font-medium px-3 py-1.5 rounded-md">
            Search
          </button>
        </form>
      </section>

      <section className="bg-cream px-6 pb-12 pt-2 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {listings.length === 0 && (
          <p className="text-sm text-muted col-span-full">
            No listings match yet.{' '}
            <Link href="/signup" className="text-steel font-medium">
              Be the first to list one
            </Link>
            .
          </p>
        )}
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </section>

      <Footer />
    </div>
  )
}
