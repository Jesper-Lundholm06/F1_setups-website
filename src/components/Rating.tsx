import { useState } from 'react'
import { StarIcon } from './Icons'

interface RatingProps {
  value: number
  /** Provide onChange to make it interactive. Omit for a read-only display. */
  onChange?: (value: number) => void
  size?: 'sm' | 'lg'
}

export function Rating({ value, onChange, size = 'sm' }: RatingProps) {
  const [hover, setHover] = useState(0)
  const interactive = typeof onChange === 'function'
  const shown = hover || value

  if (!interactive) {
    return (
      <span className={`stars ${size === 'lg' ? 'stars--lg' : ''}`} aria-label={`Rating ${value} of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} className={`star ${n <= value ? 'star--on' : ''}`} filled={n <= value} />
        ))}
      </span>
    )
  }

  return (
    <span
      className={`stars ${size === 'lg' ? 'stars--lg' : ''}`}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="starbtn"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(value === n ? 0 : n)}
        >
          <StarIcon className={`star ${n <= shown ? 'star--on' : ''}`} filled={n <= shown} />
        </button>
      ))}
    </span>
  )
}
