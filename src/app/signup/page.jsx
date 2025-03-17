"use client"

import React, { useState } from 'react';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
            router.push('/login');
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl rounded-lg overflow-hidden">
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-sm text-gray-600 uppercase">Start Your Journey</h2>
                        <h1 className="text-2xl font-bold mt-2">Create an Account</h1>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign up
                        </button>
                    </form>
                    <div className="mt-6">
                        <button
                            onClick={() => signIn('google')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign up with Google
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>


                </div>

                <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                    <Image
                        src="/logo.png"
                        alt="Signup Image"
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