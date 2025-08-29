import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Managers } from '@/pages/Managers'
import { Products } from '@/pages/Products'
import { Attributions } from '@/pages/Attributions'
import { Ranking } from '@/pages/Ranking'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'gerentes':
        return (
          <ProtectedRoute requireAdmin={true}>
            <Managers />
          </ProtectedRoute>
        )
      case 'produtos':
        return (
          <ProtectedRoute requireAdmin={true}>
            <Products />
          </ProtectedRoute>
        )
      case 'atribuicoes':
        return <Attributions />
      case 'ranking':
        return <Ranking />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Layout 
          activeItem={currentPage} 
          onPageChange={setCurrentPage}
        >
          {renderPage()}
        </Layout>
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App

