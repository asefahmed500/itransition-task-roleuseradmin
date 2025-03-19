"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaLock, FaUnlock, FaTrash } from 'react-icons/fa'; // Import icons

const UserDashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) setUsers(data.users);
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Handle block/unblock action (for single or multiple users)
  const handleBlockUnblock = async (action) => {
    try {
      // Check if the current user is blocked
      const currentUser = users.find((user) => user._id === session.user.id);
      if (currentUser && currentUser.isBlocked) {
        toast.error('Your account is blocked. You cannot perform any actions.');
        return;
      }

      // Check if the user is trying to unblock themselves
      if (action === 'unblock' && selectedUsers.includes(session.user.id)) {
        toast.error('You cannot unblock yourself.');
        return;
      }

      const endpoint = selectedUsers.length > 1 ? '/api/admin/users/bulk' : `/api/admin/users/${selectedUsers[0]}`;
      const method = 'PUT';
      const body = selectedUsers.length > 1 ? JSON.stringify({ userIds: selectedUsers, action }) : JSON.stringify({ isBlocked: action === 'block' });

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map((user) =>
          selectedUsers.includes(user._id) ? { ...user, isBlocked: action === 'block' } : user
        ));
        setSelectedUsers([]);
        toast.success(`User(s) ${action === 'block' ? 'blocked' : 'unblocked'} successfully!`);
      } else {
        toast.error(data.message || 'Failed to update user(s) status.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  // Handle delete action (for single or multiple users)
  const handleDelete = async () => {
    try {
      const endpoint = selectedUsers.length > 1 ? '/api/admin/users/bulk' : `/api/admin/users/${selectedUsers[0]}`;
      const method = 'DELETE';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: selectedUsers.length > 1 ? JSON.stringify({ userIds: selectedUsers }) : null,
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
        setSelectedUsers([]);
        toast.success('User(s) deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete user(s).');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-white w-64 p-6 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-600">{session.user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-xl font-bold mb-2">User</h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block py-2 px-4 bg-blue-500 text-white rounded-lg">Dashboard</Link>
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
        <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">Total Users: {users.length}</div>
          <div className="bg-white p-6 rounded-lg shadow-md">Active Users: {users.filter(u => !u.isBlocked).length}</div>
          <div className="bg-white p-6 rounded-lg shadow-md">Blocked Users: {users.filter(u => u.isBlocked).length}</div>
        </div>

        {/* Toolbar for Actions */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md flex space-x-4">
          <button
            onClick={() => handleBlockUnblock('block')}
            disabled={selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked}
            className={`px-4 py-2 bg-red-500 text-white rounded flex items-center space-x-2 ${selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
          >
            <FaLock />
            <span>Block</span>
          </button>
          <button
            onClick={() => handleBlockUnblock('unblock')}
            disabled={selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked}
            className={`px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2 ${selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
          >
            <FaUnlock />
            <span>Unblock</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked}
            className={`px-4 py-2 bg-red-500 text-white rounded flex items-center space-x-2 ${selectedUsers.length === 0 || users.find((user) => user._id === session.user.id)?.isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>

        {/* Manage Users Table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) =>
                      setSelectedUsers(e.target.checked ? users.map((user) => user._id) : [])
                    }
                  />
                </th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td className="p-2 text-gray-800">{user.name}</td>
                  <td className="p-2 text-gray-800">{user.email}</td>
                  <td className="p-2 text-gray-800">{user.role}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
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

export default UserDashboardPage;