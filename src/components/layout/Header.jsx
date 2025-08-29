import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Header({ title = 'Gerencia Atribuições', userName = 'admin', onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Bem vindo, <span className="font-medium">{userName}!</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={onLogout}
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}

