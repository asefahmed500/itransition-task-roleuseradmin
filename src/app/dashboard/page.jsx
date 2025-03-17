'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show a loading spinner while the session is being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Do not render the page if the user is not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-600">
              {session.user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome, {session.user.name}</h1>
          <p className="text-gray-600 mb-6">{session.user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Account Details</h2>
            <p className="text-gray-600">Role: {session.user.role}</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;