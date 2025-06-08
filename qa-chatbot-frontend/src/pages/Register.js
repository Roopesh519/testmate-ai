import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        username, email, password
      });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
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

        <h2 className="text-white text-xl font-semibold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={register}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
