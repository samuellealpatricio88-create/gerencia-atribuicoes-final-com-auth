import { Card, CardContent } from '@/components/ui/card'

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-500',
  className = '' 
}) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {value?.toLocaleString?.() || value}
            </p>
          </div>
          
          {Icon && (
            <div className={`p-3 rounded-full bg-gray-50 ${iconColor}`}>
              <Icon size={24} />
            </div>
          )}
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          {Icon && <Icon size={80} />}
        </div>
      </CardContent>
    </Card>
  )
}

