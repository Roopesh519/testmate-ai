import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const token = localStorage.getItem('token');

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.history.map(item => ({
        prompt: item.prompt,
        response: item.response
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { prompt: input, response: '...' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [
        ...prev.slice(0, -1),
        { prompt: input, response: res.data.reply }
      ]);
    } catch (err) {
      alert('Error sending message');
    }
  };

  return (
    <div>
      <h2>QA ChatBot</h2>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid gray', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>You:</b> {msg.prompt}<br />
            <b>Bot:</b> {msg.response}<br /><br />
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your test-related question..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
