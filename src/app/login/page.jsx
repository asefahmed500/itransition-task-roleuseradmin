"use client";
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session } = useSession(); // Use the session hook

  useEffect(() => {
    if (session) {
      console.log('Session:', session); // Debug the session
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      alert(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h2 className="text-sm text-gray-600 uppercase">Start Your Journey</h2>
            <h1 className="text-2xl font-bold mt-2">Sign in to The App</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>

              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Image
            src="/logo.png"
            alt="Login Image"
            width={400}
            height={600}
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;