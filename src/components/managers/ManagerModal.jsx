import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { ManagerDetails } from './ManagerDetails'

const platforms = [
  { id: 'braip', name: 'Braip' },
  { id: 'keed', name: 'Keed' },
  { id: 'payt', name: 'Payt' },
  { id: 'hest', name: 'Hest' }
]

export function ManagerModal({ isOpen, onClose, onSave, manager = null }) {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    name: '', // Corresponds to generalName
    phone: '',
    braip_name: '',
    braip_email: '',
    braip_document: '',
    keed_name: '',
    keed_email: '',
    keed_document: '',
    payt_name: '',
    payt_email: '',
    payt_document: '',
    hest_name: '',
    hest_email: '',
    hest_document: ''
  })

  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name || '',
        phone: manager.phone || '',
        braip_name: manager.braip_name || '',
        braip_email: manager.braip_email || '',
        braip_document: manager.braip_document || '',
        keed_name: manager.keed_name || '',
        keed_email: manager.keed_email || '',
        keed_document: manager.keed_document || '',
        payt_name: manager.payt_name || '',
        payt_email: manager.payt_email || '',
        payt_document: manager.payt_document || '',
        hest_name: manager.hest_name || '',
        hest_email: manager.hest_email || '',
        hest_document: manager.hest_document || ''
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        braip_name: '',
        braip_email: '',
        braip_document: '',
        keed_name: '',
        keed_email: '',
        keed_document: '',
        payt_name: '',
        payt_email: '',
        payt_document: '',
        hest_name: '',
        hest_email: '',
        hest_document: ''
      })
    }
  }, [manager, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePlatformChange = (platformId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`${platformId}_${field}`]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {manager ? 'Editar Gerente' : 'Adicionar Gerente'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('general')}
            >
              Dados Gerais
            </button>
            <button
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'platforms'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('platforms')}
            >
              Detalhes por Plataforma
            </button>
            {manager && (
              <button
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Métricas e Detalhes
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* General Data Tab */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Geral do Gerente:</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome geral do gerente"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone:</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Digite o telefone"
                  />
                </div>
              </div>
            )}

            {/* Platform Details Tab */}
            {activeTab === 'platforms' && (
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <Card key={platform.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`${platform.id}-name`}>Nome na {platform.name}:</Label>
                        <Input
                          id={`${platform.id}-name`}
                          value={formData[`${platform.id}_name`] || ''}
                          onChange={(e) => handlePlatformChange(platform.id, 'name', e.target.value)}
                          placeholder={`Nome do gerente na ${platform.name}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${platform.id}-email`}>E-mail na {platform.name}:</Label>
                        <Input
                          id={`${platform.id}-email`}
                          type="email"
                          value={formData[`${platform.id}_email`] || ''}
                          onChange={(e) => handlePlatformChange(platform.id, 'email', e.target.value)}
                          placeholder={`E-mail do gerente na ${platform.name}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${platform.id}-document`}>Documento na {platform.name}:</Label>
                        <Input
                          id={`${platform.id}-document`}
                          value={formData[`${platform.id}_document`] || ''}
                          onChange={(e) => handlePlatformChange(platform.id, 'document', e.target.value)}
                          placeholder={`Nome do documento na ${platform.name}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Manager Details Tab */}
            {activeTab === 'details' && manager && (
              <ManagerDetails manager={manager} />
            )}
          </div>

          {/* Footer */}
          {activeTab !== 'details' && (
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Salvar
              </Button>
            </div>
          )}

          {/* Footer para aba de detalhes */}
          {activeTab === 'details' && (
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button type="button" variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}


