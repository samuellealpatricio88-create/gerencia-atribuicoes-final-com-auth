import { hasPermission } from '../../utils/permissions';

const RoleGuard = ({ children, permission, userRole, fallback = null }) => {
  if (!hasPermission(userRole, permission)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;

