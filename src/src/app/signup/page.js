import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignupForm from '@/components/SignupForm'

export default function SignupPage() {
  return (
    <div>
      <Nav />
      <section className="bg-cream px-6 py-12 flex justify-center min-h-[60vh]">
        <SignupForm />
      </section>
      <Footer />
    </div>
  )
}
