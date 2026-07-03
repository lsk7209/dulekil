export const size = { width: 180, height: 180 }
export const contentType = 'image/svg+xml'

export default function AppleIcon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <rect width="180" height="180" rx="40" fill="#2F4A3C"/>
      <path d="M38 130 90 50l52 80H38Z" fill="#C4D1C7"/>
    </svg>`,
    { headers: { 'content-type': contentType } },
  )
}
