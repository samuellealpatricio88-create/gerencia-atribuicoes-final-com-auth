import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

const platforms = [
  { id: 'all', name: 'Selecione uma plataforma' },
  { id: 'braip', name: 'Braip' },
  { id: 'keed', name: 'Keed' },
  { id: 'payt', name: 'Payt' },
  { id: 'hest', name: 'Hest' }
]

const managers = [
  { id: 'all', name: 'Selecione um gerente' },
  { id: 'larissa', name: 'LARISSA MIRANDA' },
  { id: 'gerente-a', name: 'Gerente A' },
  { id: 'gerente-b', name: 'Gerente B' }
]

export function AttributionFilters({ 
  selectedPlatform, 
  selectedManager, 
  onPlatformChange, 
  onManagerChange,
  onAddEmails 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Platform Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma
            </label>
            <Select value={selectedPlatform} onValueChange={onPlatformChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Manager Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerente
            </label>
            <Select value={selectedManager} onValueChange={onManagerChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um gerente" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Emails Button */}
          <div>
            <Button 
              onClick={onAddEmails}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedPlatform === 'all' || selectedManager === 'all'}
            >
              <Plus size={20} className="mr-2" />
              Adicionar E-mails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

