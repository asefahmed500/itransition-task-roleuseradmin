'use client';

import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaExternalLinkAlt } from "react-icons/fa";

const NavBar = () => {
    const { data: session } = useSession();

    const navOptions = (
        <>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            {/* Role-based navigation options */}
            {session?.user?.role === 'user' && (
                <li><Link href="/dashboard"> User Dashboard <FaExternalLinkAlt /></Link></li>
            )}
            {session?.user?.role === 'admin' && (
                <li><Link href="/admin/dashboard"> Admin Dashboard <FaExternalLinkAlt /></Link></li>
            )}
        </>
    );

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navOptions}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">ROLE BASED USER</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navOptions}
                    </ul>
                </div>
                <div className="navbar-end">
                    {session ? (
                        <button className="btn" onClick={() => signOut()}>Logout</button>
                    ) : (
                        <Link href='/login' className="btn">Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;