'use client'

import { useState } from 'react'
import type { Conversion } from '@/lib/types'
import { Phone, Hash, Calendar, ChevronDown, ChevronUp, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConversionsTableProps {
  conversions: Conversion[]
}

export function ConversionsTable({ conversions }: ConversionsTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  if (conversions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">Sin conversiones todavía</p>
          <p className="text-sm">Las conversiones aparecerán aquí cuando los usuarios se suscriban</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Teléfono</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Variante</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Hash</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Headers</th>
          </tr>
        </thead>
        <tbody>
          {conversions.map((conversion) => (
            <tr 
              key={conversion.id} 
              className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{conversion.phone}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {conversion.transaction_id.slice(0, 8)}...
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                  ${conversion.variant === 'A' 
                    ? 'bg-chart-1/10 text-chart-1' 
                    : 'bg-chart-2/10 text-chart-2'}
                `}>
                  Variante {conversion.variant}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="font-mono text-sm font-semibold">{conversion.hash}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(conversion.created_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </td>
              <td className="py-4 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedRow(
                    expandedRow === conversion.id ? null : conversion.id
                  )}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Ver
                  {expandedRow === conversion.id ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {conversions.map((conversion) => (
          <div 
            key={conversion.id}
            className="bg-muted/50 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm">{conversion.phone}</span>
              </div>
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                ${conversion.variant === 'A' 
                  ? 'bg-chart-1/10 text-chart-1' 
                  : 'bg-chart-2/10 text-chart-2'}
              `}>
                {conversion.variant}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono font-semibold">{conversion.hash}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(conversion.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setExpandedRow(
                expandedRow === conversion.id ? null : conversion.id
              )}
            >
              <Globe className="w-4 h-4 mr-2" />
              Ver Headers
              {expandedRow === conversion.id ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>

            {expandedRow === conversion.id && (
              <HeadersDisplay headers={conversion.headers} />
            )}
          </div>
        ))}
      </div>

      {/* Headers Expanded Row (Desktop) */}
      {expandedRow && (
        <div className="hidden md:block">
          {conversions.filter(c => c.id === expandedRow).map(conversion => (
            <div key={`headers-${conversion.id}`} className="bg-muted/50 rounded-xl p-4 mt-2">
              <HeadersDisplay headers={conversion.headers} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HeadersDisplay({ headers }: { headers: Record<string, string> }) {
  const relevantHeaders = ['user-agent', 'accept-language', 'referer', 'host']
  const filteredHeaders = Object.entries(headers).filter(
    ([key]) => relevantHeaders.includes(key.toLowerCase())
  )

  if (filteredHeaders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No hay headers relevantes</p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Request Headers
      </p>
      <div className="grid gap-2">
        {filteredHeaders.map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="font-medium text-foreground">{key}:</span>{' '}
            <span className="text-muted-foreground break-all">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
