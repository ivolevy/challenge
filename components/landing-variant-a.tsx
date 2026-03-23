'use client'

import { useState } from 'react'
import { Phone, ArrowRight, CheckCircle2, Star, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LandingVariantAProps {
  onInputFocus: () => void
  onInputChange: () => void
  onSubmit: (phone: string) => void
  isSubmitting: boolean
  error: string | null
}

export default function LandingVariantA({
  onInputFocus,
  onInputChange,
  onSubmit,
  isSubmitting,
  error
}: LandingVariantAProps) {
  const [phone, setPhone] = useState('')
  const [hasTyped, setHasTyped] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+\-\s]/g, '')
    setPhone(value)
    if (!hasTyped) {
      onInputChange()
      setHasTyped(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 8) {
      onSubmit(phone)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-accent blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 text-accent" fill="currentColor" />
                <span>Trusted by 10,000+ businesses</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Impulsa tu negocio al{' '}
                <span className="text-accent">siguiente nivel</span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-lg">
                Obtén acceso exclusivo a herramientas de crecimiento, 
                insights personalizados y una comunidad de emprendedores exitosos.
              </p>

              {/* Features */}
              <div className="grid gap-4 mb-8">
                {[
                  'Análisis de datos en tiempo real',
                  'Automatización inteligente',
                  'Soporte 24/7 personalizado'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-primary-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Únete a nuestra comunidad
                </h2>
                <p className="text-muted-foreground">
                  Recibe acceso gratuito por tiempo limitado
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Tu número de teléfono"
                    value={phone}
                    onChange={handlePhoneChange}
                    onFocus={onInputFocus}
                    className="pl-12 h-14 text-lg"
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="text-destructive text-sm text-center bg-destructive/10 py-2 px-4 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                  disabled={phone.length < 8 || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Suscribirme gratis
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>12,000+ usuarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>98% satisfacción</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Empresas que confían en nosotros
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['TechCorp', 'Innovate', 'StartUp', 'GrowthCo', 'NextGen'].map((company) => (
              <span key={company} className="text-lg md:text-xl font-bold text-foreground/70">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
