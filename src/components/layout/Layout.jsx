import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '../auth/AuthProvider'

export function Layout({ children, activeItem = 'dashboard', onPageChange }) {
  const [currentPage, setCurrentPage] = useState(activeItem)
  const { user, userRole } = useAuth()

  const handleMenuClick = (itemId, path) => {
    setCurrentPage(itemId)
    onPageChange?.(itemId)
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Gerencia Atribuições'
      case 'gerentes': return 'Gerenciamento de Gerentes'
      case 'produtos': return 'Gestão de Produtos'
      case 'atribuicoes': return 'Atribuições'
      case 'ranking': return 'Ranking'
      default: return 'Gerencia Atribuições'
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'operator':
        return 'Operador'
      default:
        return 'Usuário'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={currentPage} 
        onItemClick={handleMenuClick}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          title={getPageTitle()} 
          userName={user?.email || 'Usuário'}
          userRole={getRoleDisplayName(userRole)}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

