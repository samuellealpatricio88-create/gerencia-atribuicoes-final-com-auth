import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { ManagerModal } from './ManagerModal'
import { supabase } from '../../supabaseClient'

export function ManagerList() {
  const [managers, setManagers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingManager, setEditingManager] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from('managers')
      .select('*')
    if (error) {
      console.error('Erro ao buscar gerentes:', error)
    } else {
      setManagers(data)
    }
  }

  const handleAddManager = () => {
    setEditingManager(null)
    setIsModalOpen(true)
  }

  const handleEditManager = (manager) => {
    setEditingManager(manager)
    setIsModalOpen(true)
  }

  const handleDeleteManager = async (managerId) => {
    if (window.confirm('Tem certeza que deseja excluir este gerente?')) {
      const { error } = await supabase
        .from('managers')
        .delete()
        .eq('id', managerId)
      if (error) {
        console.error('Erro ao deletar gerente:', error)
      } else {
        setManagers(managers.filter(m => m.id !== managerId))
      }
    }
  }

  const handleSaveManager = async (managerData) => {
    if (editingManager) {
      // Update existing manager
      const { data, error } = await supabase
        .from('managers')
        .update(managerData)
        .eq('id', editingManager.id)
        .select()
      if (error) {
        console.error('Erro ao atualizar gerente:', error)
      } else {
        setManagers(managers.map(m => 
          m.id === editingManager.id 
            ? data[0]
            : m
        ))
      }
    } else {
      // Add new manager
      const { data, error } = await supabase
        .from('managers')
        .insert(managerData)
        .select()
      if (error) {
        console.error('Erro ao adicionar gerente:', error)
      } else {
        setManagers([...managers, data[0]])
      }
    }
    setIsModalOpen(false)
    setEditingManager(null)
  }

  const filteredManagers = managers.filter(manager => 
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (manager.phone && manager.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Gerentes</h2>
        <Button onClick={handleAddManager} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" />
          Adicionar Gerente
        </Button>
      </div>

      {/* Filtro de Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Gerentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Managers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Gerentes ({filteredManagers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">NOME</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">TELEFONE</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{manager.name}</td>
                    <td className="py-3 px-4">{manager.phone}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditManager(manager)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteManager(manager.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredManagers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      Nenhum gerente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manager Modal */}
      <ManagerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingManager(null)
        }}
        onSave={handleSaveManager}
        manager={editingManager}
      />
    </div>
  )
}


