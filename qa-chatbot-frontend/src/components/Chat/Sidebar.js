import React from 'react';

export default function Sidebar({ conversations, onSelectConversation, onNewChat }) {
  return (
    <aside className="hidden md:block w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-white border-opacity-20">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white border-opacity-20 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Chat History</h3>
          <button
            onClick={onNewChat}
            className="text-sm text-blue-400 hover:underline focus:outline-none"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm">No conversations yet</p>
          ) : (
            <ul className="space-y-3">
              {conversations.map(conv => (
                <li
                  key={conv._id}
                  onClick={() => onSelectConversation(conv._id)}
                  className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer"
                >
                  <div className="text-sm text-blue-200 truncate">{conv.title}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
