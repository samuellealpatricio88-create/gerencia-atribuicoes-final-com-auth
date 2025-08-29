import { useAuth } from './AuthProvider'
import { LoginPage } from './LoginPage'

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta página. 
              Esta área é restrita apenas para administradores.
            </p>
            <p className="text-sm text-gray-500">
              Seu nível de acesso: <span className="font-semibold capitalize">{userRole}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

