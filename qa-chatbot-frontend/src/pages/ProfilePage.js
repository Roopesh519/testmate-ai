import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ChatHeader from '../components/Chat/ChatHeader';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('You must be logged in to access your profile.');
            window.location.href = '/login';
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
                setName(res.data.username); // backend uses `username`, not `name`
            } catch (err) {
                setError('Failed to load profile');
            }
        };

        fetchProfile();

        // Set viewport height for mobile compatibility
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => window.removeEventListener('resize', setViewportHeight);
    }, [token]);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    }, [showMobileMenu]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/profile`,
                { name, password: password || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully!');
            setPassword('');
            // Clear success message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } catch (err) {
            setError('Update failed');

            // Clear error message after 5 seconds
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    if (!user) {
        return (
            <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
                <div className="flex flex-col flex-1 relative min-h-0">
                    <ChatHeader
                        setShowSidebar={() => { }} // No sidebar functionality
                        showMobileMenu={showMobileMenu}
                        setShowMobileMenu={setShowMobileMenu}
                        handleLogout={handleLogout}
                    />
                    <main className="flex-1 p-4 min-h-0 pb-0">
                        <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
                            <div className="flex-1 flex items-center justify-center text-gray-600">
                                <p className="text-lg">Loading profile...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
            <div className="flex flex-col flex-1 relative min-h-0">
                <ChatHeader
                    setShowSidebar={() => { }} // No sidebar functionality
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                    handleLogout={handleLogout}
                />
                <main className="flex-1 p-4 min-h-0 pb-0">
                    <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-2xl mx-auto p-6">
                                <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block font-medium mb-1 text-gray-700">User ID</label>
                                        <input
                                            type="text"
                                            value={user._id}
                                            readOnly
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1 text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1 text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border text-gray-800 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1 text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            placeholder="Password change disabled"
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled
                                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-500 placeholder-gray-400 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Update Profile
                                    </button>
                                </form>

                                {message && (
                                    <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}