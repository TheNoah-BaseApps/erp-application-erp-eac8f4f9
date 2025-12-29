export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES_REP: 'sales_rep',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Products
  PRODUCTS_READ: 'products:read',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  
  // Product Costs
  COSTS_READ: 'costs:read',
  COSTS_CREATE: 'costs:create',
  COSTS_UPDATE: 'costs:update',
  COSTS_DELETE: 'costs:delete',
  
  // Customers
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',
  
  // Dashboard & Reports
  DASHBOARD_VIEW: 'dashboard:view',
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.COSTS_READ,
    PERMISSIONS.COSTS_CREATE,
    PERMISSIONS.COSTS_UPDATE,
    PERMISSIONS.COSTS_DELETE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.CUSTOMERS_DELETE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.COSTS_READ,
    PERMISSIONS.COSTS_CREATE,
    PERMISSIONS.COSTS_UPDATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  [ROLES.SALES_REP]: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.DASHBOARD_VIEW
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.COSTS_READ,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW
  ]
};

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

export function canAccessResource(userRole, resource, action) {
  const permissionKey = `${resource}:${action}`;
  return hasPermission(userRole, permissionKey);
}

export function getRoleLabel(role) {
  const labels = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.SALES_REP]: 'Sales Representative',
    [ROLES.VIEWER]: 'Viewer'
  };
  return labels[role] || role;
}

export function getRoleColor(role) {
  const colors = {
    [ROLES.ADMIN]: 'red',
    [ROLES.MANAGER]: 'blue',
    [ROLES.SALES_REP]: 'green',
    [ROLES.VIEWER]: 'gray'
  };
  return colors[role] || 'gray';
}