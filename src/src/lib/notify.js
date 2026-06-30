// Sends the "you have a new rental request" email to an equipment owner.
// Uses Resend (https://resend.com) — free to start, no credit card needed
// for low volume. If RESEND_API_KEY isn't set yet, this just logs to the
// terminal instead of sending, so the app works fine before you set it up.
export async function notifyOwnerOfRequest({ ownerEmail, ownerName, listingTitle, renterName, startDate, endDate, message }) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(
      `[notify] Would email ${ownerName} <${ownerEmail}>: ${renterName} requested "${listingTitle}" (${startDate} → ${endDate}). Add RESEND_API_KEY in .env.local to actually send this.`
    )
    return { sent: false, reason: 'no_api_key' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'WheelHouse Carolina <onboarding@resend.dev>',
        to: ownerEmail,
        subject: `New rental request: ${listingTitle}`,
        html: `
          <p>Hi ${ownerName},</p>
          <p><strong>${renterName}</strong> requested to rent <strong>${listingTitle}</strong>
          from ${startDate} to ${endDate}.</p>
          ${message ? `<p>Their message: "${message}"</p>` : ''}
          <p>Log in to your dashboard to accept or decline.</p>
        `,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[notify] Resend API error:', res.status, body)
      return { sent: false, reason: 'api_error' }
    }
    return { sent: true }
  } catch (err) {
    console.error('[notify] Failed to send email:', err)
    return { sent: false, reason: 'network_error' }
  }
}
