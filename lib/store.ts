import type { TrackingEvent, Conversion } from './types'

// In-memory store for demo (would be a database in production)
export const trackingEvents: TrackingEvent[] = []
export const conversions: Conversion[] = []

export function addEvent(event: TrackingEvent) {
  trackingEvents.push(event)
}

export function addConversion(conversion: Conversion) {
  conversions.push(conversion)
}

export function getTrackingEvents() {
  return trackingEvents
}

export function getConversions() {
  return conversions
}

export function generateHash(phone: string, transactionId: string): string {
  // Simple hash for demo
  const str = `${phone}-${transactionId}-${Date.now()}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')
}
