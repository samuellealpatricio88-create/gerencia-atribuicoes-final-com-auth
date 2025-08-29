import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AttributionFilters } from './AttributionFilters'
import { EmailModal } from './EmailModal'
import { TagBadge } from './TagBadge'

export function AttributionList() {
  const [selectedPlatform, setSelectedPlatform] = useState('keed')
  const [selectedManager, setSelectedManager] = useState('larissa')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [attributions, setAttributions] = useState([])

  const handleAddEmails = () => {
    setIsEmailModalOpen(true)
  }

  const handleSaveEmails = (emailList) => {
    // Generate random tags for demo
    const tags = ['TODOS', 'CHÁ', 'BLACK', 'MAX', 'LONG', 'TOOP']
    
    const newAttributions = emailList.map((email, index) => ({
      id: Date.now() + index,
      email,
      platform: selectedPlatform,
      manager: selectedManager,
      tag: tags[Math.floor(Math.random() * tags.length)],
      createdAt: new Date()
    }))

    setAttributions([...attributions, ...newAttributions])
  }

  // Filter attributions based on selected platform and manager
  const filteredAttributions = attributions.filter(attr => {
    const platformMatch = selectedPlatform === 'all' || attr.platform === selectedPlatform
    const managerMatch = selectedManager === 'all' || attr.manager === selectedManager
    return platformMatch && managerMatch
  })

  const platformName = selectedPlatform === 'keed' ? 'Keed' : 
                      selectedPlatform === 'braip' ? 'Braip' :
                      selectedPlatform === 'payt' ? 'Payt' :
                      selectedPlatform === 'hest' ? 'Hest' : 'Todas'

  const managerName = selectedManager === 'larissa' ? 'LARISSA MIRANDA' :
                     selectedManager === 'gerente-a' ? 'Gerente A' :
                     selectedManager === 'gerente-b' ? 'Gerente B' : 'Todos'

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Atribuições</h2>

      {/* Filters */}
      <AttributionFilters
        selectedPlatform={selectedPlatform}
        selectedManager={selectedManager}
        onPlatformChange={setSelectedPlatform}
        onManagerChange={setSelectedManager}
        onAddEmails={handleAddEmails}
      />

      {/* Current Selection Display */}
      {selectedPlatform !== 'all' && selectedManager !== 'all' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800">
                ({platformName.toUpperCase()} - {managerName})
              </h3>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tag Filters */}
      {selectedPlatform !== 'all' && selectedManager !== 'all' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">E-MAIL</span>
              <div className="flex flex-wrap gap-2">
                <TagBadge tag="TODOS" />
                <TagBadge tag="CHÁ" />
                <TagBadge tag="BLACK" />
                <TagBadge tag="MAX" />
                <TagBadge tag="LONG" />
                <TagBadge tag="TOOP" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attributions List */}
      <Card>
        <CardContent className="p-6">
          {filteredAttributions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma atribuição encontrada. Adicione e-mails para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttributions.map((attribution) => (
                <div 
                  key={attribution.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {attribution.email}
                    </span>
                    <TagBadge tag={attribution.tag} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {attribution.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSave={handleSaveEmails}
        platform={platformName}
        manager={managerName}
      />
    </div>
  )
}

