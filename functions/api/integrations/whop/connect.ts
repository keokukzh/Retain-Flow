export async function onRequestPost() {
  const res = new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  res.headers.append('Set-Cookie', 'whop_connected=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000');
  return res;
}


