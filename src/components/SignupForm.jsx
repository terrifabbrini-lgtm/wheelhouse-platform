'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border-tan rounded-lg p-6 max-w-sm w-full">
      <h1 className="font-display font-bold text-xl mb-1">Create your account</h1>
      <p className="text-sm text-muted mb-5">
        One account to list equipment and rent from others.
      </p>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3.5">
          {error}
        </p>
      )}

      <label className="text-xs text-muted block mb-1">Name</label>
      <input
        required
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Jane Carter"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Email</label>
      <input
        required
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="jane@email.com"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Phone (optional)</label>
      <input
        type="text"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="(919) 555-0123"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Password</label>
      <input
        required
        type="password"
        minLength={8}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="At least 8 characters"
        className="w-full mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange text-asphalt font-semibold text-sm py-2.5 rounded-md disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <p className="text-sm text-muted text-center mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-steel font-medium">
          Log in
        </Link>
      </p>
    </form>
  )
}
