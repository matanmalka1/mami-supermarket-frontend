import { useState, useCallback } from 'react';
import { UserRole } from '../types/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    !!(localStorage.getItem('mami_token') || sessionStorage.getItem('mami_token'))
  );
  
  const [userRole, setUserRole] = useState<UserRole | null>(() => 
    localStorage.getItem('mami_role') as UserRole || null
  );

  const login = useCallback((role: UserRole, token: string, remember: boolean) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('mami_role', role);
    if (remember) {
      localStorage.setItem('mami_token', token);
    } else {
      sessionStorage.setItem('mami_token', token);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mami_token');
    localStorage.removeItem('mami_role');
    sessionStorage.removeItem('mami_token');
    sessionStorage.removeItem('mami_manual_store_visit');
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return { isAuthenticated, userRole, login, logout };
};