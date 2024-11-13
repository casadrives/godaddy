import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export function DriverChat() {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    {
      id: '1',
      sender: 'company',
      content: 'New ride request in your area. Are you available?',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      sender: 'driver',
      content: 'Yes, I can take it.',
      timestamp: '10:31 AM',
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-8rem)]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
          Company Chat
        </h2>
      </div>

      <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === 'driver'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}