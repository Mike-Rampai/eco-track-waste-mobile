-- Phase 1: Critical Database Security Fixes

-- 1. Create the missing add_eco_points function for Stripe webhook
CREATE OR REPLACE FUNCTION public.add_eco_points(user_id uuid, points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET eco_points = COALESCE(eco_points, 0) + points,
      updated_at = now()
  WHERE id = user_id;
  
  -- If no profile exists, create one with the points
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, eco_points, created_at, updated_at)
    VALUES (user_id, points, now(), now())
    ON CONFLICT (id) DO UPDATE SET 
      eco_points = COALESCE(profiles.eco_points, 0) + points,
      updated_at = now();
  END IF;
END;
$$;

-- 2. Fix all existing functions to have proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = $1
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(user_id uuid DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT admin_role
  FROM public.admin_users
  WHERE admin_users.user_id = $1
  AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.get_realtime_stats()
RETURNS json
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Add proper triggers for updated_at columns where missing
DO $$
BEGIN
  -- Check and add trigger for profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Check and add trigger for admin_users table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_admin_users_updated_at'
  ) THEN
    CREATE TRIGGER update_admin_users_updated_at
      BEFORE UPDATE ON public.admin_users
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 4. Add balance verification function for payments
CREATE OR REPLACE FUNCTION public.verify_sufficient_balance(user_id uuid, amount numeric, currency text DEFAULT 'ZAR')
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT balance >= amount 
     FROM public.wallet_balances 
     WHERE wallet_balances.user_id = $1 
     AND wallet_balances.currency = $3), 
    false
  );
$$;

-- 5. Create admin initialization function for first-time setup
CREATE OR REPLACE FUNCTION public.initialize_first_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid uuid;
  admin_count integer;
BEGIN
  -- Check if any admin users already exist
  SELECT COUNT(*) INTO admin_count FROM public.admin_users WHERE is_active = true;
  
  -- Only allow if no admins exist
  IF admin_count > 0 THEN
    RETURN false;
  END IF;
  
  -- Get user ID from email
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  
  -- Create super admin
  INSERT INTO public.admin_users (user_id, admin_role, is_active, created_at, updated_at)
  VALUES (user_uuid, 'super_admin', true, now(), now())
  ON CONFLICT (user_id) DO UPDATE SET
    admin_role = 'super_admin',
    is_active = true,
    updated_at = now();
    
  RETURN true;
END;
$$;