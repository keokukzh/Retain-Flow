export async function onRequestPost(context: { request: Request }) {
  try {
    const { email, password } = await context.request.json();
    if (!email || !password) {
      return json({ message: 'Email and password required' }, 400);
    }
    // In a real app, insert user into DB and send verification mail
    return json({ message: 'Registration successful' }, 201);
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


