import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  // Read the secondary logo from the public folder
  const logoPath = join(process.cwd(), 'public', 'CPS-SecondaryLogo.png')
  const logoData = readFileSync(logoPath)
  const base64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'transparent',
          overflow: 'hidden'
        }}
      >
        <img
          src={base64}
          style={{
            width: '150px',
            height: '50px',
            objectFit: 'contain',
            marginLeft: '-22px', // Offsets the transparent space left of the "C"
            marginTop: '0px'
          }}
        />
      </div>
    ),
    { ...size }
  )
}
