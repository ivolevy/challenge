'use client'

import { useState } from 'react'
import { Phone, Sparkles, Rocket, Shield, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LandingVariantBProps {
  onInputFocus: () => void
  onInputChange: () => void
  onSubmit: (phone: string) => void
  isSubmitting: boolean
  error: string | null
}

export default function LandingVariantB({
  onInputFocus,
  onInputChange,
  onSubmit,
  isSubmitting,
  error
}: LandingVariantBProps) {
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
    <main className="min-h-screen bg-card">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Nueva plataforma disponible</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Transforma tus ideas en
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-accent to-chart-2">
              resultados reales
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Accede a la plataforma líder en crecimiento empresarial. 
            Más de 50,000 empresas ya están creciendo con nosotros.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Rocket,
              title: 'Crecimiento acelerado',
              description: 'Escala tu negocio 3x más rápido con nuestras herramientas'
            },
            {
              icon: Shield,
              title: 'Seguridad garantizada',
              description: 'Protección de datos de nivel empresarial incluida'
            },
            {
              icon: Zap,
              title: 'Automatización total',
              description: 'Ahorra 20+ horas semanales con flujos automáticos'
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="bg-background border border-border rounded-2xl p-6 hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-xl mx-auto">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Empieza tu prueba gratuita
              </h2>
              <p className="text-primary-foreground/80">
                Sin compromisos. Cancela cuando quieras.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <Input
                  type="tel"
                  placeholder="Ingresa tu teléfono"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={onInputFocus}
                  className="pl-12 h-14 text-lg bg-primary-foreground text-primary placeholder:text-primary/50 border-0"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="text-accent-foreground text-sm text-center bg-destructive py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={phone.length < 8 || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  'Comenzar ahora'
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-foreground/60">
              <Clock className="w-4 h-4" />
              <span>Configuración en menos de 2 minutos</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-accent fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-foreground italic mb-2">
              &quot;Esta plataforma cambió completamente la forma en que gestionamos nuestro negocio&quot;
            </blockquote>
            <cite className="text-sm text-muted-foreground not-italic">
              — María García, CEO de InnovateTech
            </cite>
          </div>
        </div>
      </div>
    </main>
  )
}
