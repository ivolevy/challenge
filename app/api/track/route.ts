import { NextResponse } from 'next/server'
import { addEvent } from '@/lib/store'
import type { TrackingEvent } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const event: TrackingEvent = await request.json()
    addEvent(event)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
