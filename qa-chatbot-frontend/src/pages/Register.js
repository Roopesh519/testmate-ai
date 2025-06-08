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
      await axios.post('http://localhost:5000/api/auth/register', {
        username, email, password
      });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={register}>Register</button>
    </div>
  );
}
