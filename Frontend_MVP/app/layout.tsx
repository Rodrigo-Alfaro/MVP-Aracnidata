import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aracnidata',
  description: 'Aracnidata is a website for developers',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/aracnidata-logo.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
