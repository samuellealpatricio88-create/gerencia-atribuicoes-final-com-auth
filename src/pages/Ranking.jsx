import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'

// Dados mock para o ranking baseado em atribuições por produto
const mockRankingData = [
  {
    id: 1,
    manager: 'LARISSA MIRANDA',
    attributionsByProduct: {
      SECAPS: 400,
      CHÁ: 200,
      MAX: 150,
      LONG: 100,
      TOOP: 50,
      NEUMAX: 20
    }
  },
  {
    id: 2,
    manager: 'CARLOS SILVA',
    attributionsByProduct: {
      SECAPS: 350,
      CHÁ: 180,
      MAX: 120,
      LONG: 90,
      TOOP: 45,
      NEUMAX: 15
    }
  },
  {
    id: 3,
    manager: 'ANA COSTA',
    attributionsByProduct: {
      SECAPS: 300,
      CHÁ: 150,
      MAX: 100,
      LONG: 80,
      TOOP: 40,
      NEUMAX: 10
    }
  },
  {
    id: 4,
    manager: 'JOÃO SANTOS',
    attributionsByProduct: {
      SECAPS: 250,
      CHÁ: 120,
      MAX: 90,
      LONG: 70,
      TOOP: 35,
      NEUMAX: 8
    }
  },
  {
    id: 5,
    manager: 'MARIA OLIVEIRA',
    attributionsByProduct: {
      SECAPS: 200,
      CHÁ: 100,
      MAX: 80,
      LONG: 60,
      TOOP: 30,
      NEUMAX: 5
    }
  }
]

const periods = [
  { value: 'current_month', label: 'Mês Atual' },
  { value: 'last_month', label: 'Mês Anterior' },
  { value: 'last_3_months', label: 'Últimos 3 Meses' },
  { value: 'last_6_months', label: 'Últimos 6 Meses' },
  { value: 'current_year', label: 'Ano Atual' }
]

export function Ranking() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')

  // Calcular total de atribuições para cada gerente e ordenar
  const rankedData = mockRankingData
    .map(manager => {
      const totalAttributions = Object.values(manager.attributionsByProduct).reduce((sum, count) => sum + count, 0)
      return {
        ...manager,
        totalAttributions
      }
    })
    .sort((a, b) => b.totalAttributions - a.totalAttributions)
    .map((manager, index) => ({
      ...manager,
      position: index + 1
    }))

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  const topManager = rankedData[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ranking de Gerentes</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking por Atribuições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Posição</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Gerente</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SECAPS</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">CHÁ</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">MAX</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">LONG</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">TOOP</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">NEUMAX</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {rankedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(item.position)}
                        <span className="font-bold text-lg">#{item.position}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{item.manager}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.SECAPS}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.CHÁ}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.MAX}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.LONG}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.TOOP}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold">{item.attributionsByProduct.NEUMAX}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-bold text-lg text-blue-600">{item.totalAttributions}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Gerente</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topManager?.manager}</div>
            <p className="text-xs text-muted-foreground">
              {topManager?.totalAttributions} atribuições totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto Mais Atribuído</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SECAPS</div>
            <p className="text-xs text-muted-foreground">
              Produto com mais atribuições
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atribuições</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rankedData.reduce((sum, manager) => sum + manager.totalAttributions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Atribuições de todos os gerentes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

