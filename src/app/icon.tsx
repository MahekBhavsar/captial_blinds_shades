import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const size = { width: 256, height: 256 }
export const contentType = 'image/png'

export default function Icon() {
  const logoPath = join(process.cwd(), 'public', 'Capital-Blend&Shades-logo.jpg.jpeg')
  const logoData = readFileSync(logoPath)
  const base64 = `data:image/jpeg;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '256px',
          height: '256px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <img
          src={base64}
          style={{
            width: '256px',
            height: '256px',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      width: 256,
      height: 256,
    }
  )
}
