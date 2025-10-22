export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { apiKey } = await context.request.json();
    
    if (!apiKey) {
      return json({ error: 'API key required' }, 400);
    }
    
    // Validate API key by hitting Whop API
    const response = await fetch('https://api.whop.com/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return json({ error: 'Invalid API key' }, 400);
    }
    
    const userData = await response.json();
    
    // Store API key in KV
    await context.env.INTEGRATIONS_KV.put(
      'whop:api_key',
      JSON.stringify({
        apiKey,
        userId: userData.id,
        username: userData.username,
        connectedAt: new Date().toISOString(),
      })
    );
    
    return json({ success: true, user: userData }, 200);
  } catch (error) {
    return json({ error: 'Failed to connect Whop' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}


