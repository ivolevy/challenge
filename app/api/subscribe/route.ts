import { NextResponse } from 'next/server'
import { addConversion, addEvent, generateHash } from '@/lib/store'
import type { Variant, Conversion } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, transaction_id, variant } = body as {
      phone: string
      transaction_id: string
      variant: Variant
    }

    if (!phone || !transaction_id || !variant) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate hash
    const hash = generateHash(phone, transaction_id)

    // Store conversion
    const conversion: Conversion = {
      id: crypto.randomUUID(),
      phone,
      transaction_id,
      variant,
      hash,
      created_at: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries())
    }

    addConversion(conversion)

    // Track conversion event
    addEvent({
      transaction_id,
      variant,
      event_type: 'conversion',
      timestamp: new Date().toISOString(),
      metadata: { phone }
    })

    return NextResponse.json({ success: true, hash })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
