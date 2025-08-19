import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      checkAdminStatus();
    } else if (!loading) {
      setCheckingAdmin(false);
      setIsAdmin(false);
      setUserRole(null);
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
      setUserRole(null);
    } finally {
      setCheckingAdmin(false);
    }
  };

  return {
    isAdmin,
    userRole,
    checkingAdmin,
    loading: loading || checkingAdmin,
  };
};