import jwt from 'jsonwebtoken';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { email, password } = await context.request.json();
    if (!email || !password) {
      return json({ message: 'Email and password required' }, 400);
    }

    // Placeholder auth: accept any password length >= 6
    if (typeof password !== 'string' || password.length < 6) {
      return json({ message: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ sub: email }, context.env.JWT_SECRET, { expiresIn: '1h' });
    const res = json({ token }, 200);
    setCookie(res, 'rf_token', token, 60 * 60);
    return res;
  } catch (e) {
    return json({ message: 'Bad Request' }, 400);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function setCookie(res: Response, name: string, value: string, maxAgeSeconds: number) {
  const cookie = `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
  res.headers.append('Set-Cookie', cookie);
}


