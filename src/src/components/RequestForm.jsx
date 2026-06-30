'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestForm({ listingId, isOwner, isLoggedIn }) {
  const router = useRouter()
  const [form, setForm] = useState({ startDate: '', endDate: '', message: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isLoggedIn) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="w-full bg-orange text-asphalt font-semibold text-sm py-3 rounded-md"
      >
        Log in to request
      </button>
    )
  }

  if (isOwner) {
    return <p className="text-sm text-muted text-center">This is your own listing.</p>
  }

  if (sent) {
    return (
      <div className="text-center py-2">
        <p className="font-display font-bold text-sm mb-1.5">Request sent</p>
        <p className="text-xs text-muted">The owner will respond directly.</p>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, ...form }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      return
    }
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3">
          {error}
        </p>
      )}
      <div className="flex gap-2.5 mb-3">
        <div className="flex-1">
          <label className="text-xs text-muted block mb-1">Start date</label>
          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted block mb-1">End date</label>
          <input
            required
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full"
          />
        </div>
      </div>
      <label className="text-xs text-muted block mb-1">Message (optional)</label>
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Pickup time, questions..."
        className="w-full min-h-[60px] resize-none rounded-md border border-border-tan p-2 text-sm mb-3.5"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange text-asphalt font-semibold text-sm py-3 rounded-md disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Request to rent'}
      </button>
    </form>
  )
}
