import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers
        }
      );
    }

    const BUTTONDOWN_API_KEY = import.meta.env.BUTTONDOWN_API_KEY;
    if (!BUTTONDOWN_API_KEY) {
      console.error('BUTTONDOWN_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers
        }
      );
    }

    // Get client IP for spam validation
    const clientIP = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const buttondownResponse = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Collision-Behavior': 'overwrite'
      },
      body: JSON.stringify({
        email_address: email,
        type: 'regular',
        ip_address: clientIP.split(',')[0].trim() // Take first IP if multiple
      })
    });

    if (buttondownResponse.ok) {
      const responseData = await buttondownResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed!',
          subscriber: {
            email: responseData.email_address,
            id: responseData.id
          }
        }),
        {
          status: 200,
          headers
        }
      );
    }

    // Handle errors
    const errorData = await buttondownResponse.json().catch(() => ({}));

    // Handle rate limiting
    if (buttondownResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Too many subscription attempts. Please try again later.' }),
        {
          status: 429,
          headers
        }
      );
    }

    // Handle 400 errors with specific codes
    if (buttondownResponse.status === 400) {
      const errorCode = errorData.code;

      if (errorCode === 'email_already_exists') {
        // With overwrite, this shouldn't happen, but handle gracefully
        return new Response(
          JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
          {
            status: 200,
            headers
          }
        );
      }

      if (errorCode === 'email_blocked' || errorCode === 'email_invalid') {
        return new Response(
          JSON.stringify({ error: 'This email address cannot be subscribed' }),
          {
            status: 400,
            headers
          }
        );
      }
    }

    // Generic error for other cases
    console.error('Buttondown API error:', buttondownResponse.status, errorData);
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
      {
        status: 500,
        headers
      }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      {
        status: 500,
        headers
      }
    );
  }
};
