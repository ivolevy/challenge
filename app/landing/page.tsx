'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { trackEvent } from '@/lib/tracking'
import type { Variant } from '@/lib/types'
import LandingVariantA from '@/components/landing-variant-a'
import LandingVariantB from '@/components/landing-variant-b'

function LandingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transactionId = searchParams.get('tid') || ''
  const variant = (searchParams.get('v') as Variant) || 'A'

  // Track page view on mount
  useEffect(() => {
    if (transactionId) {
      trackEvent(transactionId, variant, 'page_view')
    }
  }, [transactionId, variant])

  const handleInputFocus = useCallback(() => {
    trackEvent(transactionId, variant, 'input_focus')
  }, [transactionId, variant])

  const handleInputChange = useCallback(() => {
    trackEvent(transactionId, variant, 'input_typing')
  }, [transactionId, variant])

  const handleSubmit = useCallback(async (phone: string) => {
    trackEvent(transactionId, variant, 'button_click')
    setIsSubmitting(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const response = await fetch(`${baseUrl}/api/subscribe.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          transaction_id: transactionId,
          variant
        })
      })

      const data = await response.json()

      if (response.ok && data.hash) {
        router.push(`/thank-you?hash=${data.hash}`)
      } else {
        setError(data.error || 'Ha ocurrido un error. Por favor intenta de nuevo.')
      }
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }, [transactionId, variant, router])

  const props = {
    onInputFocus: handleInputFocus,
    onInputChange: handleInputChange,
    onSubmit: handleSubmit,
    isSubmitting,
    error
  }

  return variant === 'A' ? (
    <LandingVariantA {...props} />
  ) : (
    <LandingVariantB {...props} />
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    }>
      <LandingContent />
    </Suspense>
  )
}
