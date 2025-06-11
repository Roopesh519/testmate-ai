import React from 'react';

export default function MobileSidebar({ messages, showSidebar, setShowSidebar }) {
  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-white border-opacity-20 z-50
        transform transition-transform duration-300 ease-in-out md:hidden
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-white border-opacity-20">
            <h3 className="text-lg font-bold text-white">Chat History</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm">No chat history yet</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer"
                  >
                    <div className="text-sm text-blue-200 truncate">{msg.prompt}</div>
                    <div className="text-xs text-gray-400 mt-1 truncate">{msg.response?.substring(0, 50)}...</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
