'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestActions({ requestId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function respond(status) {
    setLoading(true)
    await fetch(`/api/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => respond('accepted')}
        className="bg-orange text-asphalt text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-60"
      >
        Accept
      </button>
      <button
        disabled={loading}
        onClick={() => respond('declined')}
        className="border border-border-tan text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-60"
      >
        Decline
      </button>
    </div>
  )
}
