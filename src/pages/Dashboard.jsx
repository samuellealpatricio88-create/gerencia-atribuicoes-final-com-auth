import { useState, useEffect } from 'react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AttributionsPieChart } from '@/components/dashboard/PieChart'
import { AttributionsBarChart } from '@/components/dashboard/BarChart'
import {
  Users,
  CheckSquare,
  UserCheck,
  Building2,
  Calendar as CalendarIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { supabase } from '../supabaseClient'

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalAttributions: 0,
    attributionsToday: 0,
    attributionsByOperator: 0,
    totalPlatforms: 4
  })

  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [attributionsByOperatorData, setAttributionsByOperatorData] = useState([])

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch total attributions
      const { data: attributions, error: attributionsError } = await supabase
        .from('attributions')
        .select('*')
        .eq('is_attributed', true)

      if (attributionsError) {
        console.error('Erro ao buscar atribuições:', attributionsError)
        return
      }

      // Fetch managers for operator data
      const { data: managers, error: managersError } = await supabase
        .from('managers')
        .select('id, name')

      if (managersError) {
        console.error('Erro ao buscar gerentes:', managersError)
        return
      }

      // Calculate metrics
      const totalAttributions = attributions.length
      const today = new Date().toISOString().split('T')[0]
      const attributionsToday = attributions.filter(attr => 
        attr.created_at && attr.created_at.startsWith(today)
      ).length

      // Group by platform
      const platformCounts = attributions.reduce((acc, attr) => {
        acc[attr.platform] = (acc[attr.platform] || 0) + 1
        return acc
      }, {})

      // Group by manager (operator)
      const managerCounts = attributions.reduce((acc, attr) => {
        const manager = managers.find(m => m.id === attr.manager_id)
        if (manager) {
          acc[manager.name] = (acc[manager.name] || 0) + 1
        }
        return acc
      }, {})

      // Update metrics
      setMetrics({
        totalAttributions,
        attributionsToday,
        attributionsByOperator: Object.keys(managerCounts).length,
        totalPlatforms: 4
      })

      // Platform colors
      const platformColors = {
        braip: '#f59e0b',
        keed: '#ef4444',
        payt: '#f97316',
        hest: '#8b5cf6'
      }

      // Update chart data
      const pieData = Object.entries(platformCounts).map(([platform, count]) => ({
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        value: count,
        color: platformColors[platform] || '#6b7280'
      }))

      const barData = Object.entries(platformCounts).map(([platform, count]) => ({
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        value: count
      }))

      setPieChartData(pieData)
      setBarChartData(barData)

      // Update operator data
      const operatorData = Object.entries(managerCounts).map(([name, count]) => ({
        name,
        attributions: count,
        date: new Date().toISOString().split('T')[0] // Mock date for now
      }))

      setAttributionsByOperatorData(operatorData)

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    }
  }

  const handleExportCSV = () => {
    const csvData = barChartData.map(item => `${item.name},${item.value}`).join('\n')
    const csvContent = `Plataforma,Atribuições\n${csvData}`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'atribuicoes_por_plataforma.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filtered data for attributions by operator
  const filteredAttributionsByOperator = attributionsByOperatorData.filter(item => {
    if (!dateRange.from && !dateRange.to) return true;
    const itemDate = new Date(item.date);
    if (dateRange.from && itemDate < dateRange.from) return false;
    if (dateRange.to && itemDate > dateRange.to) return false;
    return true;
  });

  // Aggregate data for display
  const aggregatedAttributions = filteredAttributionsByOperator.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.attributions;
    return acc;
  }, {});

  const displayAttributions = Object.keys(aggregatedAttributions).map(name => ({
    name,
    attributions: aggregatedAttributions[name]
  })).sort((a, b) => b.attributions - a.attributions);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Atribuições"
          value={metrics.totalAttributions}
          icon={CheckSquare}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Atribuições Hoje"
          value={metrics.attributionsToday}
          icon={UserCheck}
          iconColor="text-green-500"
        />
        <MetricCard
          title="Operadores Ativos"
          value={metrics.attributionsByOperator}
          icon={Users}
          iconColor="text-purple-500"
        />
        <MetricCard
          title="Total de Plataformas"
          value={metrics.totalPlatforms}
          icon={Building2}
          iconColor="text-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttributionsPieChart 
          data={pieChartData}
          title="Atribuições por Plataforma"
        />
        <AttributionsBarChart 
          data={barChartData}
          title="Atribuições por Plataforma"
          onExportCSV={handleExportCSV}
        />
      </div>

      {/* New Card for Attributions by Operator */}
      <Card>
        <CardHeader>
          <CardTitle>Atribuições por Operador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "LLL dd, y", { locale: ptBR })} - {format(dateRange.to, "LLL dd, y", { locale: ptBR })}</>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Operador</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Atribuições</th>
                </tr>
              </thead>
              <tbody>
                {displayAttributions.length > 0 ? (
                  displayAttributions.map((operator) => (
                    <tr key={operator.name} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{operator.name}</div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-semibold">{operator.attributions}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                      Nenhuma atribuição encontrada para o período selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

