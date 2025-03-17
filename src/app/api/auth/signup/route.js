import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ success: false, message: 'Please provide all fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: 'User already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ success: true, message: 'User registered successfully' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}