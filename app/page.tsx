'use client'

import { useRouter } from 'next/navigation'
import { generateTransactionId, assignVariant, trackEvent } from '@/lib/tracking'
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'

export default function BannerPage() {
  const router = useRouter()

  const handleBannerClick = () => {
    const transactionId = generateTransactionId()
    const variant = assignVariant()
    
    // Track banner click
    trackEvent(transactionId, variant, 'banner_click')
    
    // Redirect to landing page
    router.push(`/landing?tid=${transactionId}&v=${variant}`)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Simulated Ad Banner */}
        <div 
          onClick={handleBannerClick}
          className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative p-8 md:p-12 lg:p-16">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent/60 text-accent-foreground px-4 py-2 rounded-lg text-xs font-bold tracking-wider mb-6 shadow-lg shadow-accent/30 border border-accent/40 uppercase">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-foreground"></span>
              </span>
              <span>⏳ Tiempo limitado</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                  Conecta con tu audiencia
                  <span className="block text-accent">de manera inteligente</span>
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
                  La plataforma que transforma visitantes en clientes fieles. 
                  Aumenta tus conversiones con tecnología de punta.
                </p>
              </div>

              {/* Stats Preview */}
              <div className="flex flex-col gap-4 lg:min-w-[200px]">
                <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                  <BarChart3 className="w-8 h-8 text-accent" />
                  <div>
                    <div className="text-2xl font-bold">+340%</div>
                    <div className="text-sm text-primary-foreground/70">ROI promedio</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 text-accent" />
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-primary-foreground/70">Uptime garantizado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold text-lg group-hover:gap-4 transition-all duration-300">
                <span>Comenzar ahora</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-sm text-primary-foreground/60">Sin tarjeta de crédito</span>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center mt-6 text-muted-foreground text-sm">
          Haz clic arriba para empezar
        </p>
      </div>
    </main>
  )
}
