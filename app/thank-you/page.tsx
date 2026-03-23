'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { CheckCircle, Copy, ArrowRight, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash') || ''
  const [copied, setCopied] = useState(false)

  const copyHash = async () => {
    await navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center shadow-lg">
          {/* Success Icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <div className="absolute -right-2 -top-2">
              <PartyPopper className="w-8 h-8 text-chart-4" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Registro exitoso
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Te has suscrito correctamente. Pronto recibirás toda la información 
            en tu teléfono.
          </p>

          {/* Hash Display */}
          <div className="bg-muted rounded-2xl p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-3">
              Tu código de confirmación
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl md:text-3xl font-mono font-bold text-foreground tracking-wider">
                {hash}
              </code>
              <button
                onClick={copyHash}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                title="Copiar código"
              >
                <Copy className={`w-5 h-5 ${copied ? 'text-accent' : 'text-muted-foreground'}`} />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-accent mt-2">Copiado al portapapeles</p>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-3 text-left bg-background border border-border rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Próximos pasos:</h3>
            {[
              'Recibirás un mensaje de confirmación',
              'Accede al dashboard de control',
              'Configura tus preferencias'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-accent">{i + 1}</span>
                </div>
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full h-12 text-base">
              <Link href="/dashboard">
                Ver Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-12 text-base">
              <Link href="/">
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Guarda tu código de confirmación para futuras referencias
        </p>
      </div>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
