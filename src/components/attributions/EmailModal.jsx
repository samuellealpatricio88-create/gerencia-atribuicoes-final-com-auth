import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from 'lucide-react'

export function EmailModal({ isOpen, onClose, onSave, platform, manager }) {
  const [emails, setEmails] = useState('')
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Parse emails from textarea
    const emailList = emails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && isValidEmail(email))

    if (emailList.length === 0) {
      alert('Por favor, insira pelo menos um e-mail válido.')
      return
    }

    // Remove duplicates if option is checked
    const finalEmailList = ignoreDuplicates 
      ? [...new Set(emailList)]
      : emailList

    onSave(finalEmailList)
    setEmails('')
    onClose()
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Adicionar E-mails</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Instructions */}
            <p className="text-sm text-gray-600">
              Cole ou digite e-mails, um por linha. O sistema irá validar o formato e 
              remover duplicados.
            </p>

            {/* Email Textarea */}
            <div>
              <Textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Ex: email1@exemplo.com&#10;email2@exemplo.com"
                rows={8}
                className="w-full"
                required
              />
            </div>

            {/* Options */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ignoreDuplicates"
                checked={ignoreDuplicates}
                onCheckedChange={setIgnoreDuplicates}
              />
              <label 
                htmlFor="ignoreDuplicates" 
                className="text-sm text-gray-700 cursor-pointer"
              >
                Ignorar duplicados e adicionar apenas únicos
              </label>
            </div>

            {/* Selected filters info */}
            {platform && manager && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Plataforma:</strong> {platform} | <strong>Gerente:</strong> {manager}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

