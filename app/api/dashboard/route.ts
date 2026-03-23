import { NextResponse } from 'next/server'
import { getConversions, getTrackingEvents } from '@/lib/store'
import type { FunnelStep } from '@/lib/types'

export async function GET() {
  const events = getTrackingEvents()
  const conversions = getConversions()

  // Calculate funnel metrics
  const bannerClicks = events.filter(e => e.event_type === 'banner_click').length
  const pageViews = events.filter(e => e.event_type === 'page_view').length
  const interactions = events.filter(
    e => e.event_type === 'input_focus' || e.event_type === 'input_typing'
  ).length
  const buttonClicks = events.filter(e => e.event_type === 'button_click').length
  const conversionCount = conversions.length

  const maxValue = Math.max(bannerClicks, 1)

  const funnel: FunnelStep[] = [
    {
      name: 'Banner Click',
      count: bannerClicks,
      percentage: (bannerClicks / maxValue) * 100
    },
    {
      name: 'Page View',
      count: pageViews,
      percentage: (pageViews / maxValue) * 100
    },
    {
      name: 'Interaction',
      count: interactions,
      percentage: (interactions / maxValue) * 100
    },
    {
      name: 'Button Click',
      count: buttonClicks,
      percentage: (buttonClicks / maxValue) * 100
    },
    {
      name: 'Conversion',
      count: conversionCount,
      percentage: (conversionCount / maxValue) * 100
    }
  ]

  // Variant breakdown
  const variantA = conversions.filter(c => c.variant === 'A').length
  const variantB = conversions.filter(c => c.variant === 'B').length

  return NextResponse.json({
    conversions,
    funnel,
    stats: {
      total: conversionCount,
      variantA,
      variantB,
      totalEvents: events.length
    }
  })
}
