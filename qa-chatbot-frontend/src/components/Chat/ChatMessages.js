import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // or your preferred style

function CodeBlock({ children }) {
  const code = children[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative group">
      <pre className="rounded bg-black bg-opacity-70 text-white p-3 overflow-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-1 right-1 text-xs text-blue-300 bg-black bg-opacity-50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
      >
        Copy
      </button>
    </div>
  );
}

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
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-xl bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm">{msg.prompt}</p>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex justify-start">
              <div className="max-w-xl bg-white bg-opacity-90 text-black rounded-lg px-4 py-2 shadow-md prose prose-sm prose-invert">
                <ReactMarkdown
                  children={msg.response}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code: CodeBlock
                  }}
                />
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={chatRef} />
    </div>
  );
}
