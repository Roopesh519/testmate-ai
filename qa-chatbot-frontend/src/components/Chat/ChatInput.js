import React from 'react';

export default function ChatInput({ input, setInput, sendMessage, handleKeyPress }) {
  return (
    <div className="p-4 border-t border-black border-opacity-20 flex-shrink-0 bg-white bg-opacity-5">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your test-related question..."
          className="flex-1 px-4 py-3 bg-white bg-opacity-20 text-black placeholder-black placeholder-opacity-50 border border-black border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
