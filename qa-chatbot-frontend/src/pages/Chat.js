import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');
  const chatRef = useRef();

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/history`, {
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

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { prompt: input, response: '...' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, { message: input }, {
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl w-full max-w-3xl p-6">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">QA ChatBot</h2>

        <div className="h-[400px] overflow-y-auto mb-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 space-y-3 shadow-sm">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <p><span className="font-semibold text-blue-600">You:</span> {msg.prompt}</p>
              <p><span className="font-semibold text-green-600">Bot:</span> {msg.response}</p>
            </div>
          ))}
          <div ref={chatRef} />
        </div>


        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your test-related question..."
            className="flex-grow px-4 py-2 bg-white bg-opacity-30 text-white placeholder-white border border-white border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
