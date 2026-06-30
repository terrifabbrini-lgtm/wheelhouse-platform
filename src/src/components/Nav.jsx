import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default async function Nav() {
  const user = await getCurrentUser()

  return (
    <header className="bg-asphalt px-6 py-3.5 flex items-center justify-between">
      <Link href="/" className="flex items-baseline gap-1.5">
        <span className="font-display font-bold text-lg text-cream">WheelHouse</span>
        <span className="font-mono text-[10px] tracking-wider text-orange">CAROLINA</span>
      </Link>
      <nav className="flex items-center gap-5">
        <Link href="/browse" className="text-sm text-border-tan hover:text-cream">
          Browse
        </Link>
        <Link href="/how-it-works" className="text-sm text-border-tan hover:text-cream hidden sm:inline">
          How it works
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-sm text-border-tan hover:text-cream">
              Dashboard
            </Link>
            <Link
              href="/list-equipment"
              className="bg-orange text-asphalt text-sm font-medium px-3.5 py-2 rounded-md hover:opacity-90"
            >
              List a rental
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-border-tan hover:text-cream">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-orange text-asphalt text-sm font-medium px-3.5 py-2 rounded-md hover:opacity-90"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
