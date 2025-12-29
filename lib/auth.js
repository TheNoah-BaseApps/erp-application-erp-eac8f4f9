import { verifyToken, getTokenFromRequest } from './jwt';
import { getUserById } from './db';

export async function authenticateRequest(request) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return { authenticated: false, user: null, error: 'No token provided' };
    }
    
    const payload = await verifyToken(token);
    
    if (!payload) {
      return { authenticated: false, user: null, error: 'Invalid token' };
    }
    
    const user = await getUserById(payload.userId);
    
    if (!user) {
      return { authenticated: false, user: null, error: 'User not found' };
    }
    
    return { authenticated: true, user, error: null };
  } catch (error) {
    console.error('Error authenticating request:', error);
    return { authenticated: false, user: null, error: 'Authentication failed' };
  }
}

export function checkPermission(user, action, resource) {
  if (!user || !user.role) {
    return false;
  }
  
  const role = user.role;
  
  // Admin has all permissions
  if (role === 'admin') {
    return true;
  }
  
  // Manager permissions
  if (role === 'manager') {
    if (resource === 'products' || resource === 'product_costs') {
      return ['read', 'create', 'update'].includes(action);
    }
    if (resource === 'customers') {
      return ['read'].includes(action);
    }
    if (resource === 'dashboard' || resource === 'reports') {
      return action === 'read';
    }
  }
  
  // Sales rep permissions
  if (role === 'sales_rep') {
    if (resource === 'customers') {
      return ['read', 'create', 'update'].includes(action);
    }
    if (resource === 'products' || resource === 'dashboard') {
      return action === 'read';
    }
  }
  
  // Viewer permissions
  if (role === 'viewer') {
    return action === 'read';
  }
  
  return false;
}

export function requireAuth(handler) {
  return async (request, context) => {
    try {
      const auth = await authenticateRequest(request);
      
      if (!auth.authenticated) {
        return Response.json(
          { success: false, error: auth.error || 'Unauthorized' },
          { status: 401 }
        );
      }
      
      request.user = auth.user;
      
      return handler(request, context);
    } catch (error) {
      console.error('Error in requireAuth middleware:', error);
      return Response.json(
        { success: false, error: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

export function requirePermission(resource, action) {
  return (handler) => {
    return requireAuth(async (request, context) => {
      const hasPermission = checkPermission(request.user, action, resource);
      
      if (!hasPermission) {
        return Response.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(request, context);
    });
  };
}