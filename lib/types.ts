export type Variant = 'A' | 'B'

export type EventType = 
  | 'banner_click'
  | 'page_view'
  | 'input_focus'
  | 'input_typing'
  | 'button_click'
  | 'conversion'

export interface TrackingEvent {
  transaction_id: string
  variant: Variant
  event_type: EventType
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface Conversion {
  id: string
  phone: string
  transaction_id: string
  variant: Variant
  hash: string
  created_at: string
  headers: Record<string, string>
}

export interface FunnelStep {
  name: string
  count: number
  percentage: number
}
