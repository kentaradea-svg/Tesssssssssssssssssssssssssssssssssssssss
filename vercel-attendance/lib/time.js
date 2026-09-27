import { DateTime } from 'luxon'

const ZONE = 'Asia/Jakarta'

// Convert an ISO string or JS Date to WIB-formatted string
export function toWIBString(input) {
  if (!input) return null
  const dt = typeof input === 'string' ? DateTime.fromISO(input) : DateTime.fromJSDate(input)
  return dt.setZone(ZONE).toFormat('yyyy-LL-dd HH:mm:ss')
}

// Compute duration between two datetimes (on and off). Returns object {hours, minutes, seconds} and human string
export function durationBetween(onInput, offInput) {
  if (!onInput || !offInput) return null
  const a = typeof onInput === 'string' ? DateTime.fromISO(onInput) : DateTime.fromJSDate(onInput)
  const b = typeof offInput === 'string' ? DateTime.fromISO(offInput) : DateTime.fromJSDate(offInput)
  const diff = b.setZone(ZONE).diff(a.setZone(ZONE), ['hours', 'minutes', 'seconds']).toObject()
  const hours = Math.floor(diff.hours || 0)
  const minutes = Math.floor(diff.minutes || 0)
  const seconds = Math.floor(diff.seconds || 0)
  return {
    hours,
    minutes,
    seconds,
    human: `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
  }
}

// Get date string in WIB (yyyy-LL-dd)
export function dateWIB(input) {
  if (!input) return null
  const dt = typeof input === 'string' ? DateTime.fromISO(input) : DateTime.fromJSDate(input)
  return dt.setZone(ZONE).toISODate()
}

// Compute week key (Monday-Sunday) in WIB. Returns weekStart date string (yyyy-LL-dd)
export function weekKeyWIB(input) {
  const dt = typeof input === 'string' ? DateTime.fromISO(input) : DateTime.fromJSDate(input)
  const d = dt.setZone(ZONE)
  // Luxon: weekday 1=Monday ... 7=Sunday
  const weekStart = d.minus({ days: d.weekday - 1 }).startOf('day')
  return weekStart.toISODate()
}
