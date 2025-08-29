import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';

export function AddEmailModal({ isOpen, onClose, onAddEmails }) {
  const [emailInput, setEmailInput] = useState('');
  const [singleEmail, setSingleEmail] = useState('');

  const handleAddBulkEmails = () => {
    if (!emailInput.trim()) return;
    
    // Dividir por quebras de linha e filtrar e-mails válidos
    const emails = emailInput
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));
    
    if (emails.length > 0) {
      onAddEmails(emails);
      setEmailInput('');
      onClose();
    }
  };

  const handleAddSingleEmail = () => {
    if (!singleEmail.trim() || !singleEmail.includes('@')) return;
    
    onAddEmails([singleEmail.trim()]);
    setSingleEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Adicionar E-mails</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Adicionar e-mail único */}
          <div className="space-y-3">
            <Label htmlFor="singleEmail">Adicionar E-mail Único:</Label>
            <div className="flex space-x-2">
              <Input
                id="singleEmail"
                type="email"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="exemplo@email.com"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSingleEmail()}
              />
              <Button onClick={handleAddSingleEmail} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-3">
              <Label htmlFor="bulkEmails">Adicionar Múltiplos E-mails:</Label>
              <p className="text-sm text-gray-600">
                Cole uma lista de e-mails, um por linha:
              </p>
              <Textarea
                id="bulkEmails"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={`exemplo1@email.com\nexemplo2@email.com\nexemplo3@email.com`}
                rows={8}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddBulkEmails} className="bg-blue-600 hover:bg-blue-700">
            Adicionar E-mails
          </Button>
        </div>
      </div>
    </div>
  );
}

