const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

// "2 hours ago", "yesterday", or a plain date once it is older than a week
export const timeAgo = (iso) => {
  const diff = new Date(iso).getTime() - Date.now()
  if (Math.abs(diff) > 7 * 86_400_000) return formatDate(iso)

  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return 'just now'
}