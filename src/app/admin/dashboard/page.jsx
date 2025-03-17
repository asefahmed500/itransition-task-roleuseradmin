"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) setUsers(data.users);
    };

    fetchUsers();
  }, []);

  // Block/Unblock user
  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      const data = await response.json();
      console.log(data); // Debugging
      if (data.success) {
        setUsers(users.map((user) => (user._id === userId ? data.user : user)));
        toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully!`);
      } else {
        toast.error('Failed to update user status.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log(data); // Debugging
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success('User deleted successfully!');
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') router.push('/login');
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-white w-64 p-6 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-600">{session.user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Admin</h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>

        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block py-2 px-4 bg-blue-500 text-white rounded-lg">Dashboard</Link>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full mt-8 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">Total Users: {users.length}</div>
          <div className="bg-white p-6 rounded-lg shadow-md">Active Users: {users.filter(u => !u.isBlocked).length}</div>
          <div className="bg-white p-6 rounded-lg shadow-md">Blocked Users: {users.filter(u => u.isBlocked).length}</div>
        </div>

        {/* Manage Users Table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleBlockUser(user._id, user.isBlocked)}
                      className={`px-4 py-2 mr-2 ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;