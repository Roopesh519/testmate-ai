import React, { useState } from 'react';

export default function Sidebar({ conversations, onSelectConversation, onNewChat, onUpdateConversationTitle }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartEdit = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = async (convId) => {
    if (editTitle.trim() && editTitle !== conversations.find(c => c._id === convId)?.title) {
      try {
        await onUpdateConversationTitle(convId, editTitle.trim());
      } catch (error) {
        console.error('Failed to update conversation title:', error);
      }
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e, convId) => {
    if (e.key === 'Enter') handleSaveEdit(convId);
    else if (e.key === 'Escape') handleCancelEdit();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="hidden md:block w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-white border-opacity-20">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white border-opacity-20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Chat History</h3>
            <button
              onClick={onNewChat}
              className="text-sm text-blue-400 hover:underline focus:outline-none"
            >
              + New Chat
            </button>
          </div>
          <input
            type="text"
            placeholder="Search conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <p className="text-gray-400 text-sm">No conversations found</p>
          ) : (
            <ul className="space-y-3">
              {filteredConversations.map(conv => (
                <li key={conv._id} className="group relative">
                  <div
                    onClick={() => !editingId && onSelectConversation(conv._id)}
                    className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer"
                  >
                    {editingId === conv._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, conv._id)}
                          onBlur={() => handleSaveEdit(conv._id)}
                          className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-400"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(conv._id)}
                          className="text-green-400 hover:text-green-300 text-xs"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-400 hover:text-red-300 text-xs"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-200 truncate pr-2">{conv.title}</div>
                        <button
                          onClick={(e) => handleStartEdit(conv, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white text-xs transition-opacity"
                          title="Edit title"
                        >
                          <img src="compose.png" alt="Edit" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
