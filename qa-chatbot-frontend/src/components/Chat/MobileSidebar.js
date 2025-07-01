import React, { useState } from 'react';

export default function MobileSidebar({
  conversations,
  showSidebar,
  setShowSidebar,
  onSelectConversation,
  onNewChat,
  onUpdateConversationTitle
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSelect = (id) => {
    if (!editingId) {
      onSelectConversation(id);
      setShowSidebar(false); // Close after selecting
    }
  };

  const handleStartEdit = (conv, e) => {
    e.stopPropagation(); // Prevent selecting the conversation
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
    if (e.key === 'Enter') {
      handleSaveEdit(convId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleCloseSidebar = () => {
    if (editingId) {
      handleCancelEdit();
    }
    setShowSidebar(false);
  };

  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleCloseSidebar}
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
              onClick={handleCloseSidebar}
              className="text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <div className="p-4 border-b border-white border-opacity-20">
            <button
              onClick={() => {
                onNewChat();
                setShowSidebar(false);
              }}
              className="w-full text-left text-sm text-blue-400 hover:underline focus:outline-none"
            >
              + New Chat
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-sm">No conversations yet</p>
            ) : (
              <ul className="space-y-3">
                {conversations.map((conv) => (
                  <li
                    key={conv._id}
                    className="group relative"
                  >
                    <div
                      onClick={() => handleSelect(conv._id)}
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
                            className="text-green-400 hover:text-green-300 text-sm px-2"
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-400 hover:text-red-300 text-sm px-2"
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
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-gray-400 hover:text-white text-sm transition-opacity p-1"
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
    </>
  );
}
