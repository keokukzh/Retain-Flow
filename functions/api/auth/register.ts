import jwt from 'jsonwebtoken';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { email, password } = await context.request.json();
    if (!email || !password) {
      return json({ message: 'Email and password required' }, 400);
    }
    // In a real app, insert user into DB and send verification mail
    const token = jwt.sign({ sub: email, provider: 'password' }, context.env.JWT_SECRET, { expiresIn: '1h' });
    const res = json({ message: 'Registration successful', token }, 201);
    res.headers.append('Set-Cookie', `rf_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
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


