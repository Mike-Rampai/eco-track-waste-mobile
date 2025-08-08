import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Users } from 'lucide-react';

interface AdminStats {
  metric: string;
  value: number;
  description: string;
}

interface AdminUser {
  id: string;
  user_id: string;
  admin_role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      if (adminRole === 'super_admin') {
        loadAdminUsers();
      }
    }
  }, [isAdmin, adminRole]);

  const checkAdminStatus = async () => {
    try {
      const { data: adminCheck } = await supabase.rpc('is_admin');
      const { data: roleCheck } = await supabase.rpc('get_admin_role');
      
      setIsAdmin(adminCheck || false);
      setAdminRole(roleCheck || null);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoadingAdminCheck(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error loading statistics",
        description: "Failed to load admin statistics.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  const initializeFirstAdmin = async () => {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase.rpc('initialize_first_admin', {
        user_email: user.email
      });
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Admin access granted",
          description: "You have been granted super admin access.",
        });
        setIsAdmin(true);
        setAdminRole('super_admin');
      } else {
        toast({
          title: "Admin initialization failed",
          description: "Admin users already exist or user not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      toast({
        title: "Error",
        description: "Failed to initialize admin access.",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingAdminCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              You don't have admin access to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={initializeFirstAdmin} className="w-full">
              Initialize First Admin
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Click this button only if you're setting up the system for the first time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Role: <Badge variant="secondary">{adminRole}</Badge>
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {loadingStats ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.metric}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.description}
                    </p>
                    <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Admin User Management - Only for super admins */}
      {adminRole === 'super_admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin User Management
            </CardTitle>
            <CardDescription>
              Manage admin users and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email to grant admin access"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <Button disabled>Add Admin</Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Current Admin Users</h4>
                {adminUsers.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <Badge variant={admin.is_active ? "default" : "secondary"}>
                        {admin.admin_role}
                      </Badge>
                      <span className="ml-2 text-sm text-muted-foreground">
                        User ID: {admin.user_id}
                      </span>
                    </div>
                    <Badge variant={admin.is_active ? "default" : "destructive"}>
                      {admin.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Admin;