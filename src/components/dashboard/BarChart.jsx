import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function AttributionsBarChart({ 
  data = [], 
  title = 'Atribuições por Plataforma',
  onExportCSV 
}) {
  // Default data if none provided
  const defaultData = [
    { name: 'Braip', value: 400 },
    { name: 'Keed', value: 300 },
    { name: 'Payt', value: 200 },
    { name: 'Hest', value: 100 }
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExportCSV}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Download size={16} className="mr-2" />
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

