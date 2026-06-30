'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'

export default function ListingForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    pricePerDay: '',
    location: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/listings', {
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
    router.push(`/listing/${data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border-tan rounded-lg p-6 max-w-md w-full">
      <p className="font-mono text-[10px] tracking-wider text-orange uppercase mb-1">
        You keep 100% of this rate
      </p>
      <h1 className="font-display font-bold text-xl mb-5">List your RV, cart, or ATV</h1>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3.5">
          {error}
        </p>
      )}

      <label className="text-xs text-muted block mb-1">Title</label>
      <input
        required
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="DeWalt pressure washer"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Category</label>
      <select
        required
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full mb-3"
      >
        <option value="" disabled>
          Choose a category
        </option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="text-xs text-muted block mb-1">Price per day ($)</label>
      <input
        required
        type="number"
        min="1"
        step="1"
        value={form.pricePerDay}
        onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
        placeholder="45"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Location (city, NC)</label>
      <input
        required
        type="text"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        placeholder="Asheville, NC"
        className="w-full mb-3"
      />

      <label className="text-xs text-muted block mb-1">Description</label>
      <textarea
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Condition, what's included, anything renters should know..."
        className="w-full min-h-[80px] resize-none rounded-md border border-border-tan p-2 text-sm mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange text-asphalt font-semibold text-sm py-2.5 rounded-md disabled:opacity-60"
      >
        {loading ? 'Publishing...' : 'Publish listing'}
      </button>
    </form>
  )
}
