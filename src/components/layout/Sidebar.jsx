import { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CheckSquare, 
  Trophy,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../auth/AuthProvider'

const allMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    roles: ['admin', 'operator']
  },
  {
    id: 'gerentes',
    label: 'Gerentes',
    icon: Users,
    path: '/gerentes',
    roles: ['admin']
  },
  {
    id: 'produtos',
    label: 'Produtos',
    icon: Package,
    path: '/produtos',
    roles: ['admin']
  },
  {
    id: 'atribuicoes',
    label: 'Atribuições',
    icon: CheckSquare,
    path: '/atribuicoes',
    roles: ['admin', 'operator']
  },
  {
    id: 'ranking',
    label: 'Ranking',
    icon: Trophy,
    path: '/ranking',
    roles: ['admin', 'operator']
  }
]

export function Sidebar({ activeItem = 'dashboard', onItemClick, className = '' }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, userRole, signOut } = useAuth()

  // Debug logs
  console.log('Sidebar - userRole:', userRole)
  console.log('Sidebar - user:', user)

  // Filtrar itens do menu baseado no role do usuário
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole))
  
  console.log('Sidebar - menuItems after filter:', menuItems)

  const handleLogout = async () => {
    await signOut()
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
    <div className={`bg-slate-800 text-white h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">Gerencia</h1>
              <h2 className="text-lg font-bold">Atribuições</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-slate-700"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email}
              </p>
              <p className="text-xs text-slate-400">
                {getRoleDisplayName(userRole)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  } ${isCollapsed ? 'px-2' : 'px-4'}`}
                  onClick={() => onItemClick?.(item.id, item.path)}
                >
                  <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className={`w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300 ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
          onClick={handleLogout}
        >
          <LogOut size={20} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  )
}

