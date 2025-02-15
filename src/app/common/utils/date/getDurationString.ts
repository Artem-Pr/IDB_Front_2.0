import { ReactNode } from 'react'

export const getDurationString = (duration: ReactNode): ReactNode => {
  if (typeof duration !== 'number') return duration

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)

  if (hours) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes) {
    return `${minutes}m ${seconds}s`
  }
  if (seconds) {
    return `${seconds}s`
  }
  return null
}
