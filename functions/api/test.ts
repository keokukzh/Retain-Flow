export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    message: 'API Test endpoint is working!',
    timestamp: new Date().toISOString(),
    success: true
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
