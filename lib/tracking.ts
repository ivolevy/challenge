import type { EventType, Variant, TrackingEvent } from './types'

// In-memory store for demo purposes
const events: TrackingEvent[] = []

export function generateTransactionId(): string {
  return crypto.randomUUID()
}

export function assignVariant(): Variant {
  return Math.random() < 0.5 ? 'A' : 'B'
}

export function trackEvent(
  transactionId: string,
  variant: Variant,
  eventType: EventType,
  metadata?: Record<string, unknown>
): void {
  const event: TrackingEvent = {
    transaction_id: transactionId,
    variant,
    event_type: eventType,
    timestamp: new Date().toISOString(),
    metadata
  }
  
  events.push(event)
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  
  // Fire async request to backend (non-blocking)
  fetch(`${baseUrl}/api/php/track.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(() => {
    // Silently handle errors to not block UX
  })
}

export function getEvents(): TrackingEvent[] {
  return events
}
