import './globals.css'

export const metadata = {
  title: 'WheelHouse Carolina — keep 100% of your rental earnings',
  description:
    'Peer-to-peer equipment rentals across North Carolina. Owners keep 100% of their rate — renters pay one transparent processing fee.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
