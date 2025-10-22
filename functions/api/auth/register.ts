export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { name, email, password } = await context.request.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Name, email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For now, just return a success message to test if the function works
    return new Response(JSON.stringify({ 
      message: 'Register endpoint is working!',
      name: name,
      email: email,
      test: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
