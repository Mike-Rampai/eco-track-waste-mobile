-- Create admin role enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table for admin access control
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_role admin_role NOT NULL DEFAULT 'moderator',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = $1
    AND is_active = true
  );
$$;

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT admin_role
  FROM public.admin_users
  WHERE admin_users.user_id = $1
  AND is_active = true;
$$;

-- Create admin policies
CREATE POLICY "Only super admins can view all admin users"
ON public.admin_users
FOR SELECT
USING (public.get_admin_role() = 'super_admin');

CREATE POLICY "Only super admins can manage admin users"
ON public.admin_users
FOR ALL
USING (public.get_admin_role() = 'super_admin');

-- Create admin analytics view
CREATE VIEW public.admin_analytics AS
SELECT 
  'users' as metric,
  COUNT(*) as value,
  'Total registered users' as description
FROM auth.users
WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'e_waste_items' as metric,
  COUNT(*) as value,
  'Total e-waste items registered' as description
FROM public.e_waste_items
UNION ALL
SELECT 
  'collection_requests' as metric,
  COUNT(*) as value,
  'Total collection requests' as description
FROM public.collection_requests
UNION ALL
SELECT 
  'payments' as metric,
  COUNT(*) as value,
  'Total payments processed' as description
FROM public.payments
WHERE status = 'completed';

-- Create function for real-time stats
CREATE OR REPLACE FUNCTION public.get_realtime_stats()
RETURNS JSON
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL),
    'total_items', (SELECT COUNT(*) FROM public.e_waste_items),
    'active_requests', (SELECT COUNT(*) FROM public.collection_requests WHERE status = 'pending'),
    'revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'completed'),
    'recent_signups', (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours'),
    'pending_requests', (SELECT COUNT(*) FROM public.collection_requests WHERE status = 'pending')
  );
$$;

-- Enable realtime for all tables
ALTER TABLE public.e_waste_items REPLICA IDENTITY FULL;
ALTER TABLE public.collection_requests REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.admin_users REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.e_waste_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;

-- Create trigger for updated_at on admin_users
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default super admin (replace with actual user ID when needed)
-- Users will need to manually add their user ID to become admin
-- INSERT INTO public.admin_users (user_id, admin_role, created_by) 
-- VALUES ('USER_ID_HERE', 'super_admin', 'USER_ID_HERE');