import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate(); // Uncomment when using React Router

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
      setLoading(true);
      
      // Mock API call for demo - replace with your actual API
      // const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
      //   email,
      //   password
      // });

      // Mock response for demo
      const mockResponse = { data: { token: 'demo-token-12345' } };

      if (mockResponse.data.token) {
        localStorage.setItem('token', mockResponse.data.token);
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
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        
        {/* Password Input with Toggle */}
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            {showPassword ? (
              // Eye slash icon (hide password)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              // Eye icon (show password)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        
        {/* Login Button */}
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