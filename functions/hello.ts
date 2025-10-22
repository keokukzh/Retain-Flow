export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    message: 'Hello from Cloudflare Functions!',
    timestamp: new Date().toISOString(),
    test: true
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
