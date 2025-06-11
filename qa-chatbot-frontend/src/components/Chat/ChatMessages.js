import React from 'react';

export default function ChatMessages({ messages, chatRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl text-black font-bold mb-2">Welcome to QA ChatBot</h2>
            <p className="text-black text-opacity-70">Ask me anything to get started!</p>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-end">
              <div className="max-w-xl bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm">{msg.prompt}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xl bg-black bg-opacity-30 text-white rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm">{msg.response}</p>
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={chatRef} />
    </div>
  );
}
