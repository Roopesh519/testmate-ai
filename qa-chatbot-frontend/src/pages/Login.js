import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/chat';
      } else {
        alert('No token received');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative w-14 h-14">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"></div>
                <div className="text-white text-2xl font-bold z-10">T</div>
              </div>
            </div>
            <div className="text-white text-3xl font-bold tracking-tight">
              Test<span className="bg-gradient-to-br from-red-400 to-orange-500 bg-clip-text text-transparent">Mate</span><span className="bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent ml-1">AI</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <h2 className="text-white text-xl font-semibold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
