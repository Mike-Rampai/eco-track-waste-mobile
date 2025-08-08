
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = (await import('https://esm.sh/stripe@14.21.0')).default;

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const stripeClient = new stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update payment status in database
        await supabase
          .from('payments')
          .update({ status: 'completed' })
          .eq('payment_intent_id', paymentIntent.id);

        // Award eco points (example: $1 = 10 points)
        const points = Math.floor(paymentIntent.amount / 10);
        await supabase.rpc('add_eco_points', {
          user_id: paymentIntent.metadata.user_id,
          points: points
        });

        // Send notification
        await supabase.functions.invoke('send-notification', {
          body: {
            userId: paymentIntent.metadata.user_id,
            email: paymentIntent.metadata.email,
            title: 'Payment Successful',
            message: `Your payment of $${(paymentIntent.amount / 100).toFixed(2)} has been processed successfully. You earned ${points} eco points!`,
            type: 'payment_success'
          }
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('payment_intent_id', failedPayment.id);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
