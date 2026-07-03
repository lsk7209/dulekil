export const size = { width: 32, height: 32 }
export const contentType = 'image/svg+xml'

export default function Icon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#2F4A3C"/>
      <path d="M7 24 16 9l9 15H7Z" fill="#C4D1C7"/>
    </svg>`,
    { headers: { 'content-type': contentType } },
  )
}
