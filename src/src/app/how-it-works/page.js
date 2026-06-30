import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { priceBreakdown } from '@/lib/pricing'

export default function HowItWorks() {
  const example = priceBreakdown(100)

  return (
    <div>
      <Nav />
      <section className="bg-cream px-6 py-12 max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl mb-2">How WheelHouse pricing works</h1>
        <p className="text-sm text-muted mb-8">
          The short version: owners set their own price and keep every dollar of it.
          Renters pay that price plus one processing fee — that fee is the only
          money WheelHouse makes.
        </p>

        <div className="bg-white border border-border-tan rounded-lg p-5 mb-8">
          <p className="font-mono text-[10px] tracking-wider text-muted uppercase mb-3.5">
            Example: a $100/day listing
          </p>
          <div className="flex items-center justify-between py-2 border-b border-border-tan">
            <p className="text-sm">Owner&apos;s price per day</p>
            <p className="font-mono text-sm">${example.ownerReceivesPerDay.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-tan">
            <p className="text-sm">WheelHouse processing fee (8%)</p>
            <p className="font-mono text-sm">+${example.feePerDay.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="text-sm font-medium">Renter pays per day</p>
            <p className="font-mono text-sm font-medium">${example.renterPaysPerDay.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-border-tan">
            <p className="text-sm font-medium text-orange">Owner receives per day</p>
            <p className="font-mono text-base font-medium text-orange">
              ${example.ownerReceivesPerDay.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-border-tan rounded-lg p-5">
            <p className="font-mono text-[10px] tracking-wider text-orange uppercase mb-2">For owners</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-asphalt">
              <li>Create a free account</li>
              <li>List your RV, golf cart, or ATV with a price per day</li>
              <li>Accept or decline requests as they come in</li>
              <li>Keep 100% of your rate, every time</li>
            </ol>
          </div>
          <div className="bg-white border border-border-tan rounded-lg p-5">
            <p className="font-mono text-[10px] tracking-wider text-steel uppercase mb-2">For renters</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-asphalt">
              <li>Browse RVs, golf carts, and ATVs near you</li>
              <li>See the total price, fee included, before you request</li>
              <li>Send a request with your dates</li>
              <li>Hear back directly from the owner</li>
            </ol>
          </div>
        </div>

        <p className="text-xs text-muted mb-6">
          This MVP doesn&apos;t process payments yet — requests are coordinated directly
          between owner and renter while we validate demand. Pricing shown is what the
          eventual checkout will reflect.
        </p>

        <div className="flex gap-3">
          <Link href="/browse" className="bg-orange text-asphalt font-semibold text-sm px-4.5 py-2.5 rounded-md">
            Browse rentals
          </Link>
          <Link href="/signup" className="border border-steel text-sm px-4.5 py-2.5 rounded-md">
            Sign up
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
