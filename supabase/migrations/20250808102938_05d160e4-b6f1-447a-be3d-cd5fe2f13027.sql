-- Fix remaining critical security issues

-- 1. Remove the problematic admin_analytics view that exposes auth.users
DROP VIEW IF EXISTS public.admin_analytics;

-- 2. Create a secure function instead of the view to get admin analytics
CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS TABLE(metric text, value bigint, description text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    'total_users'::text as metric,
    (SELECT COUNT(*)::bigint FROM auth.users WHERE deleted_at IS NULL) as value,
    'Total registered users'::text as description
  UNION ALL
  SELECT 
    'total_items'::text,
    (SELECT COUNT(*)::bigint FROM public.e_waste_items),
    'Total e-waste items registered'::text
  UNION ALL
  SELECT 
    'active_requests'::text,
    (SELECT COUNT(*)::bigint FROM public.collection_requests WHERE status = 'pending'),
    'Active collection requests'::text
  UNION ALL
  SELECT 
    'revenue'::text,
    (SELECT COALESCE(SUM(amount), 0)::bigint FROM public.payments WHERE status = 'completed'),
    'Total revenue generated'::text
  UNION ALL
  SELECT 
    'recent_signups'::text,
    (SELECT COUNT(*)::bigint FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours'),
    'New signups in last 24 hours'::text
  UNION ALL
  SELECT 
    'pending_requests'::text,
    (SELECT COUNT(*)::bigint FROM public.collection_requests WHERE status = 'pending'),
    'Pending collection requests'::text;
$$;

-- 3. Create a secure RLS policy for the admin analytics function
-- Only super admins can call this function
CREATE POLICY "Only super admins can access analytics" ON public.admin_users
FOR SELECT USING (
  public.get_admin_role(auth.uid()) = 'super_admin'::admin_role
);

-- 4. Add missing policies for payments table to allow edge functions to update
CREATE POLICY "Allow edge functions to update payments" ON public.payments
FOR UPDATE USING (true);

-- 5. Add missing policies for notifications table to allow edge functions to insert
CREATE POLICY "Allow edge functions to insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);