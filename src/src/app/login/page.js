import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div>
      <Nav />
      <section className="bg-cream px-6 py-12 flex justify-center min-h-[60vh]">
        <LoginForm />
      </section>
      <Footer />
    </div>
  )
}
