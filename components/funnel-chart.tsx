'use client'

import type { FunnelStep } from '@/lib/types'

interface FunnelChartProps {
  funnel: FunnelStep[]
}

export function FunnelChart({ funnel }: FunnelChartProps) {
  const maxCount = Math.max(...funnel.map(s => s.count), 1)

  if (funnel.every(step => step.count === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">Sin datos todavía</p>
          <p className="text-sm">Los datos aparecerán cuando los usuarios interactúen con el funnel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {funnel.map((step, index) => {
        const percentage = (step.count / maxCount) * 100
        const isLast = index === funnel.length - 1
        
        return (
          <div key={step.name} className="relative">
            <div className="flex items-center gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center w-8">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${step.count > 0 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                {!isLast && (
                  <div className="w-0.5 h-8 bg-border mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{step.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {step.count} {step.count === 1 ? 'usuario' : 'usuarios'}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-10 bg-muted rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500 ease-out rounded-lg flex items-center"
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  >
                    {percentage >= 15 && (
                      <span className="text-sm font-semibold text-accent-foreground pl-4">
                        {step.percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {percentage < 15 && step.count > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {step.percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
