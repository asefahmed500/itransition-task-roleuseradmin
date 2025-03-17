import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request, { params }) {
  const { id } =  await params;
  const { isBlocked } = await request.json();

  try {
    await dbConnect();

    // Update the user's isBlocked status
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

    // Delete the user
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