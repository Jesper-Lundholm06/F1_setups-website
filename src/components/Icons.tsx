import type { SVGProps } from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" {...base} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" {...base} {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

export function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" {...base} {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" {...base} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  )
}

export function SlidersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" {...base} {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

export function StarIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.96 6.2 21.1l1.1-6.47L2.6 10.05l6.5-.95z" />
    </svg>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
