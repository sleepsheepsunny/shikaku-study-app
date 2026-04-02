import { createClient } from 'npm:@supabase/supabase-js@2';

interface RevenueCatEvent {
  event: {
    type: string; // INITIAL_PURCHASE | RENEWAL | CANCELLATION | EXPIRATION | UNCANCELLATION
    app_user_id: string;
    expiration_at_ms?: number;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Verify webhook secret
  const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  const authHeader = req.headers.get('Authorization');
  if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const body: RevenueCatEvent = await req.json();
    const { type, app_user_id, expiration_at_ms } = body.event;

    console.log(`[webhook-revenuecat] event=${type} user=${app_user_id}`);

    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION': {
        const expiresAt = expiration_at_ms
          ? new Date(expiration_at_ms).toISOString()
          : null;
        await supabaseClient
          .from('profiles')
          .update({ is_pro: true, pro_expires_at: expiresAt })
          .eq('id', app_user_id);
        break;
      }

      case 'CANCELLATION':
      case 'EXPIRATION': {
        await supabaseClient
          .from('profiles')
          .update({ is_pro: false })
          .eq('id', app_user_id);
        break;
      }

      default:
        console.log(`[webhook-revenuecat] unhandled event type: ${type}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[webhook-revenuecat] error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
