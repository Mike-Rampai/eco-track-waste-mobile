
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Running scheduled notifications task...');

    // Check for collection requests scheduled for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000);

    const { data: upcomingCollections, error } = await supabase
      .from('collection_requests')
      .select(`
        *,
        profiles!inner(full_name)
      `)
      .eq('status', 'approved')
      .gte('scheduled_date', tomorrowStart.toISOString())
      .lt('scheduled_date', tomorrowEnd.toISOString());

    if (error) {
      console.error('Error fetching upcoming collections:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Found ${upcomingCollections?.length || 0} upcoming collections`);

    // Send reminders for upcoming collections
    for (const collection of upcomingCollections || []) {
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: collection.user_id,
          email: `user-${collection.user_id}@example.com`, // In real app, get from profiles
          title: 'Collection Reminder',
          message: `Your e-waste collection is scheduled for tomorrow at ${collection.address}. Please ensure your items are ready for pickup.`,
          type: 'collection_reminder'
        }
      });
    }

    // Clean up old notifications (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabase
      .from('notifications')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    return new Response(JSON.stringify({ 
      success: true, 
      notificationsSent: upcomingCollections?.length || 0 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scheduled notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
