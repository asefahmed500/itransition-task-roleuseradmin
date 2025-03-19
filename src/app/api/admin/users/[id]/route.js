import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request, { params }) {
  const { id } = await params;
  const { isBlocked } = await request.json();

  try {
    await dbConnect();

    // Get the authenticated user's ID from the session
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const requestingUserId = token.id;

    // Fetch the user making the request
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the requesting user is blocked
    if (requestingUser.isBlocked) {
      return new Response(JSON.stringify({ success: false, message: 'Your account is blocked. You cannot perform any actions.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the user is trying to unblock themselves
    if (requestingUserId === id && isBlocked === false) {
      return new Response(JSON.stringify({ success: false, message: 'You cannot unblock yourself.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the user's blocked status
    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
