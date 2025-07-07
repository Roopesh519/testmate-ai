import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const login = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // ✅ Real API call
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      const token = data.token;
      if (token) {
        localStorage.setItem('token', token);
        window.location.href = '/chat';
      } else {
        setError('No token received from server.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    window.location.href = `/register?redirection_url=670f66759a11f41aa6daee68`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-4 shadow-lg">
            <img src="ai.png" alt="Logo" className="w-14 h-14 rounded-lg object-cover" />
          </div>
        </div>

        <h2 className="text-white text-xl font-semibold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <div className="relative w-full mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 mb-4"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Error message */}
        {error && <p className="text-white text-sm mb-4 text-center">{error}</p>}

        {/* Registration link */}
        <div className="text-center">
          <p className="text-white text-sm mb-2">Don't have an account?</p>
          <button
            onClick={navigateToRegister}
            className="text-blue-200 hover:text-white text-sm underline transition-colors"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}