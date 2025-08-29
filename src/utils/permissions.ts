export type UserRole = 'admin' | 'operador';

export interface Permissions {
  dashboard: boolean;
  gerentes: boolean;
  produtos: boolean;
  atribuicoes: boolean;
  ranking: boolean;
}

export const rolePermissions: Record<UserRole, Permissions> = {
  admin: {
    dashboard: true,
    gerentes: true,
    produtos: true,
    atribuicoes: true,
    ranking: true,
  },
  operador: {
    dashboard: true,
    gerentes: false,
    produtos: false,
    atribuicoes: true,
    ranking: true,
  },
};

export const hasPermission = (role: UserRole, permission: keyof Permissions): boolean => {
  return rolePermissions[role][permission];
};

export const getAvailableMenuItems = (role: UserRole) => {
  const permissions = rolePermissions[role];
  const menuItems = [];

  if (permissions.dashboard) {
    menuItems.push({ id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' });
  }
  if (permissions.gerentes) {
    menuItems.push({ id: 'gerentes', label: 'Gerentes', icon: 'Users' });
  }
  if (permissions.produtos) {
    menuItems.push({ id: 'produtos', label: 'Produtos', icon: 'Package' });
  }
  if (permissions.atribuicoes) {
    menuItems.push({ id: 'atribuicoes', label: 'Atribuições', icon: 'CheckSquare' });
  }
  if (permissions.ranking) {
    menuItems.push({ id: 'ranking', label: 'Ranking', icon: 'Trophy' });
  }

  return menuItems;
};

