import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Upload, Trash2, X, Users } from 'lucide-react';
import { AddEmailModal } from './AddEmailModal';
import { supabase } from '../../supabaseClient'; // Importar o cliente Supabase

export function AttributionMatrix() {
  const [selectedPlatform, setSelectedPlatform] = useState('braip');
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [attributionsData, setAttributionsData] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchManagers();
  }, []);

  useEffect(() => {
    if (selectedManagerId && selectedPlatform) {
      fetchAttributions();
    }
  }, [selectedManagerId, selectedPlatform]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error);
    } else {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.nickname.toUpperCase(),
        color: p.color // Usar a cor original do produto
      })));
    }
  };

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from('managers')
      .select('id, name');
    if (error) {
      console.error('Erro ao buscar gerentes:', error);
    } else {
      setManagers(data);
      if (data.length > 0) {
        setSelectedManagerId(data[0].id);
      }
    }
  };

  const fetchAttributions = async () => {
    const { data, error } = await supabase
      .from('attributions')
      .select('email, product_id, is_attributed, attribution_type')
      .eq('manager_id', selectedManagerId)
      .eq('platform', selectedPlatform);

    if (error) {
      console.error('Erro ao buscar atribuições:', error);
    } else {
      const newAttributionsData = {};
      const emailsSet = new Set();

      data.forEach(attr => {
        emailsSet.add(attr.email);
        const emailIndex = Array.from(emailsSet).indexOf(attr.email);
        newAttributionsData[`${emailIndex}-${attr.product_id}`] = attr.is_attributed;
        if (attr.attribution_type !== 'product') {
          newAttributionsData[`${emailIndex}-${attr.attribution_type}`] = attr.is_attributed;
        }
      });
      setAttributionsData({ emails: Array.from(emailsSet), attributions: newAttributionsData });
    }
  };

  const platforms = [
    { id: 'braip', name: 'Braip', color: 'bg-yellow-400' },
    { id: 'keed', name: 'Keed', color: 'bg-red-500' },
    { id: 'payt', name: 'Payt', color: 'bg-orange-500' },
    { id: 'hest', name: 'Hest', color: 'bg-purple-500' }
  ];

  const quickAttributionOptions = [
    { id: 'todos', name: 'TODOS', color: 'bg-green-500' },
  ];

  const endQuickAttributionOptions = [
    { id: 'nao_atribuido', name: 'NÃO\nATRIBUÍDO', color: 'bg-red-500' },
    { id: 'atribuido_outro', name: 'ATRIBUÍDO A\nOUTRO GERENTE', color: 'bg-purple-500' }
  ];

  const allProductsAndQuickOptions = [...quickAttributionOptions, ...products, ...endQuickAttributionOptions];

  const currentManager = managers.find(m => m.id === selectedManagerId);
  const currentEmails = attributionsData.emails || [];
  const currentAttributions = attributionsData.attributions || {};

  const updateAttributionsData = (newData) => {
    setAttributionsData(newData);
  };

  const handleAddEmails = async (newEmails) => {
    const currentEmailsSet = new Set(currentEmails);
    const emailsToAdd = newEmails.filter(email => !currentEmailsSet.has(email));

    if (emailsToAdd.length > 0) {
      const newAttributions = { ...currentAttributions };
      const newEmailsArray = [...currentEmails, ...emailsToAdd];

      for (const email of emailsToAdd) {
        const emailIndex = newEmailsArray.indexOf(email);
        // Add default attributions if needed, e.g., 'todos' selected by default
        // newAttributions[`${emailIndex}-todos`] = true;
      }
      updateAttributionsData({ emails: newEmailsArray, attributions: newAttributions });

      // Save to Supabase
      const inserts = emailsToAdd.map(email => ({
        manager_id: selectedManagerId,
        platform: selectedPlatform,
        email: email,
        product_id: null, // For general email entry
        is_attributed: false, // Or true if a default is set
        attribution_type: 'email_entry'
      }));

      const { error } = await supabase.from('attributions').insert(inserts);
      if (error) console.error('Erro ao adicionar e-mails:', error);
    }
  };

  const handleRemoveEmail = async (index) => {
    const emailToRemove = currentEmails[index];
    const updatedEmails = currentEmails.filter((_, i) => i !== index);
    const newAttributions = {};
    // Re-index attributions after removal
    Object.keys(currentAttributions).forEach(key => {
      const [emailIdx, productId] = key.split('-');
      if (parseInt(emailIdx) < index) {
        newAttributions[key] = currentAttributions[key];
      } else if (parseInt(emailIdx) > index) {
        newAttributions[`${parseInt(emailIdx) - 1}-${productId}`] = currentAttributions[key];
      }
    });
    updateAttributionsData({ emails: updatedEmails, attributions: newAttributions });

    // Delete from Supabase
    const { error } = await supabase
      .from('attributions')
      .delete()
      .eq('manager_id', selectedManagerId)
      .eq('platform', selectedPlatform)
      .eq('email', emailToRemove);
    if (error) console.error('Erro ao deletar e-mail:', error);
  };

  const handleEmailChange = async (index, newEmail) => {
    const oldEmail = currentEmails[index];
    const updatedEmails = currentEmails.map((email, i) => (i === index ? newEmail : email));
    updateAttributionsData({ emails: updatedEmails, attributions: currentAttributions });

    // Update in Supabase
    const { error } = await supabase
      .from('attributions')
      .update({ email: newEmail })
      .eq('manager_id', selectedManagerId)
      .eq('platform', selectedPlatform)
      .eq('email', oldEmail);
    if (error) console.error('Erro ao atualizar e-mail:', error);
  };

  const toggleAttribution = async (emailIndex, productId) => {
    const email = currentEmails[emailIndex];
    let newAttributions = { ...currentAttributions };

    const isCurrentlyAttributed = currentAttributions[`${emailIndex}-${productId}`];

    // Handle quick attribution options
    if (['todos', 'nao_atribuido', 'atribuido_outro'].includes(productId)) {
      // Clear all existing attributions for this email
      products.forEach(p => delete newAttributions[`${emailIndex}-${p.id}`]);
      delete newAttributions[`${emailIndex}-todos`];
      delete newAttributions[`${emailIndex}-nao_atribuido`];
      delete newAttributions[`${emailIndex}-atribuido_outro`];

      if (!isCurrentlyAttributed) { // If not currently selected, select it
        newAttributions[`${emailIndex}-${productId}`] = true;
        if (productId === 'todos') {
          products.forEach(p => {
            newAttributions[`${emailIndex}-${p.id}`] = true;
          });
        }
      }
    } else { // Handle product attribution
      // Clear quick attribution options if a product is selected
      delete newAttributions[`${emailIndex}-todos`];
      delete newAttributions[`${emailIndex}-nao_atribuido`];
      delete newAttributions[`${emailIndex}-atribuido_outro`];
      newAttributions[`${emailIndex}-${productId}`] = !isCurrentlyAttributed;
    }

    updateAttributionsData({ emails: currentEmails, attributions: newAttributions });

    // Save to Supabase
    const productItem = products.find(p => p.id === productId);
    const attributionType = productItem ? 'product' : productId;

    const { error } = await supabase
      .from('attributions')
      .upsert({
        manager_id: selectedManagerId,
        platform: selectedPlatform,
        email: email,
        product_id: productItem ? productId : null,
        is_attributed: newAttributions[`${emailIndex}-${productId}`] || false,
        attribution_type: attributionType
      }, { onConflict: 'manager_id, platform, email, product_id' });

    if (error) console.error('Erro ao salvar atribuição:', error);
  };

  return (
    <div className="space-y-3 p-3">
      {/* Header e Controles */}
      <div className="flex items-center justify-between mb-3">
        <select 
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-2 py-0.5 border rounded-md bg-white text-xs font-medium"
        >
          {platforms.map(platform => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
        <select 
          value={selectedManagerId}
          onChange={(e) => setSelectedManagerId(parseInt(e.target.value))}
          className="px-2 py-0.5 border rounded-md bg-white text-xs"
        >
          {managers.map(manager => (
            <option key={manager.id} value={manager.id}>{manager.name}</option>
          ))}
        </select>
        <div className="flex space-x-1">
          <Button variant="outline" size="xs" className="h-7 text-xs"><Upload className="h-3 w-3 mr-1" />Planilha</Button>
          <Button size="xs" onClick={() => setIsAddEmailModalOpen(true)} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />E-mail</Button>
        </div>
      </div>

      {/* Matriz de Atribuições */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-1 w-52 text-gray-700 text-xs font-semibold uppercase tracking-wider">E-MAIL ({currentEmails.length})</th>
                  {quickAttributionOptions.map((item) => (
                    <th key={item.id} className="text-center p-1 min-w-[45px]">
                      <Badge className={`${item.color} text-white text-xs px-1 py-0.5 rounded-full whitespace-pre-line`}>{item.name}</Badge>
                    </th>
                  ))}
                  {products.map((item) => (
                    <th key={item.id} className="text-center p-1 min-w-[45px]">
                      <Badge className={`${item.color} text-white text-xs px-1 py-0.5 rounded-full whitespace-pre-line`}>{item.name}</Badge>
                    </th>
                  ))}
                  {endQuickAttributionOptions.map((item) => (
                    <th key={item.id} className="text-center p-1 min-w-[45px]">
                      <Badge className={`${item.color} text-white text-xs px-1 py-0.5 rounded-full whitespace-pre-line`}>{item.name}</Badge>
                    </th>
                  ))}
                  <th className="text-center p-1 w-10 text-gray-700 text-xs font-semibold uppercase tracking-wider">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {currentEmails.map((email, emailIndex) => (
                  <tr key={emailIndex} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-1">
                      <Input 
                        value={email}
                        onChange={(e) => handleEmailChange(emailIndex, e.target.value)}
                        className="border-0 bg-transparent focus:ring-0 p-0 h-auto text-xs"
                      />
                    </td>
                    {quickAttributionOptions.map((item) => (
                      <td key={item.id} className="text-center p-1">
                        <button
                          onClick={() => toggleAttribution(emailIndex, item.id)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                            currentAttributions[`${emailIndex}-${item.id}`]
                              ? (item.id === 'nao_atribuido' || item.id === 'atribuido_outro' ? 'bg-red-500 border-red-500 text-white' : 'bg-green-500 border-green-500 text-white')
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {currentAttributions[`${emailIndex}-${item.id}`] && 
                            (item.id === 'nao_atribuido' ? <X className="h-3 w-3" /> : 
                             item.id === 'atribuido_outro' ? <Users className="h-3 w-3" /> : 
                             <Check className="h-3 w-3" />)}
                        </button>
                      </td>
                    ))}
                    {products.map((item) => (
                      <td key={item.id} className="text-center p-1">
                        <button
                          onClick={() => toggleAttribution(emailIndex, item.id)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                            currentAttributions[`${emailIndex}-${item.id}`]
                              ? (item.id === 'nao_atribuido' || item.id === 'atribuido_outro' ? 'bg-red-500 border-red-500 text-white' : 'bg-green-500 border-green-500 text-white')
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {currentAttributions[`${emailIndex}-${item.id}`] && 
                            (item.id === 'nao_atribuido' ? <X className="h-3 w-3" /> : 
                             item.id === 'atribuido_outro' ? <Users className="h-3 w-3" /> : 
                             <Check className="h-3 w-3" />)}
                        </button>
                      </td>
                    ))}
                    {endQuickAttributionOptions.map((item) => (
                      <td key={item.id} className="text-center p-1">
                        <button
                          onClick={() => toggleAttribution(emailIndex, item.id)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                            currentAttributions[`${emailIndex}-${item.id}`]
                              ? (item.id === 'nao_atribuido' || item.id === 'atribuido_outro' ? 'bg-red-500 border-red-500 text-white' : 'bg-green-500 border-green-500 text-white')
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {currentAttributions[`${emailIndex}-${item.id}`] && 
                            (item.id === 'nao_atribuido' ? <X className="h-3 w-3" /> : 
                             item.id === 'atribuido_outro' ? <Users className="h-3 w-3" /> : 
                             <Check className="h-3 w-3" />)}
                        </button>
                      </td>
                    ))}
                    <td className="text-center p-1">
                      <Button variant="ghost" size="xs" onClick={() => handleRemoveEmail(emailIndex)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-50/10 p-0.5 h-auto">
                        <Trash2 size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-1">
        <Button variant="outline" className="h-7 text-xs">Cancelar</Button>
        <Button className="bg-blue-600 hover:bg-blue-700 h-7 text-xs">Salvar Atribuições</Button>
      </div>

      <AddEmailModal
        isOpen={isAddEmailModalOpen}
        onClose={() => setIsAddEmailModalOpen(false)}
        onAddEmails={handleAddEmails}
      />
    </div>
  );
}


