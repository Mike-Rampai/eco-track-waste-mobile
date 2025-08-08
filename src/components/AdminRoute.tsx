import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  requireRole?: 'super_admin' | 'admin' | 'moderator';
}

const AdminRoute = ({ children, requireRole = 'moderator' }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else if (!loading) {
      setCheckingAdmin(false);
    }
  }, [user, loading]);

  const checkAdminStatus = async () => {
    try {
      const { data: adminCheck } = await supabase.rpc('is_admin');
      const { data: roleCheck } = await supabase.rpc('get_admin_role');
      
      setIsAdmin(adminCheck || false);
      setUserRole(roleCheck || null);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const hasRequiredRole = (userRole: string, requiredRole: string): boolean => {
    const roleHierarchy = {
      'super_admin': 3,
      'admin': 2,
      'moderator': 1
    };
    
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
           roleHierarchy[requiredRole as keyof typeof roleHierarchy];
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin || !userRole || !hasRequiredRole(userRole, requireRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;