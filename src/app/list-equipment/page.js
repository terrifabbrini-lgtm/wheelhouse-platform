import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingForm from '@/components/ListingForm'
import { getCurrentUser } from '@/lib/auth'

export default async function ListEquipmentPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div>
      <Nav />
      <section className="bg-cream px-6 py-12 flex justify-center">
        <ListingForm />
      </section>
      <Footer />
    </div>
  )
}
