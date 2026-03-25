'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowLeft,
  RefreshCw,
  Phone,
  Hash,
  Calendar,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Conversion, FunnelStep } from '@/lib/types'
import { FunnelChart } from '@/components/funnel-chart'
import { ConversionsTable } from '@/components/conversions-table'

interface DashboardData {
  conversions: Conversion[]
  funnel: FunnelStep[]
  stats: {
    total: number
    variantA: number
    variantB: number
    totalEvents: number
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    `${baseUrl}/api/dashboard.php`,
    fetcher,
    { refreshInterval: 5000 }
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard data</p>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Funnel Analytics</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-20 mb-3" />
                  <div className="h-8 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-6 h-64 animate-pulse" />
            <div className="bg-card border border-border rounded-xl p-6 h-96 animate-pulse" />
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Conversiones"
                value={data.stats.total}
                icon={Users}
                color="text-accent"
              />
              <StatCard
                label="Variante A"
                value={data.stats.variantA}
                icon={BarChart3}
                color="text-chart-1"
              />
              <StatCard
                label="Variante B"
                value={data.stats.variantB}
                icon={TrendingUp}
                color="text-chart-2"
              />
              <StatCard
                label="Total Eventos"
                value={data.stats.totalEvents}
                icon={Activity}
                color="text-chart-4"
              />
            </div>

            {/* Funnel Visualization */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Funnel de Conversión
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Visualización del recorrido del usuario
                  </p>
                </div>
              </div>
              <FunnelChart funnel={data.funnel} />
            </div>

            {/* Conversions Table */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Conversiones Recientes
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {data.conversions.length} registros totales
                  </p>
                </div>
              </div>
              <ConversionsTable conversions={data.conversions} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string
  value: number
  icon: typeof Users
  color: string 
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </div>
  )
}
