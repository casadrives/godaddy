import React, { useState } from 'react';
import { Driver } from '../../types/driver';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'ADMIN' | 'DRIVER';
  read: boolean;
}

interface DriverCommunicationProps {
  driver: Driver;
  onSendMessage: (message: string) => void;
}

const DriverCommunication: React.FC<DriverCommunicationProps> = ({
  driver,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Mock message history
  const [messages] = useState<Message[]>([
    {
      id: '1',
      content: 'Your driver license needs to be renewed',
      timestamp: new Date(Date.now() - 86400000),
      sender: 'ADMIN',
      read: true,
    },
    {
      id: '2',
      content: 'I will submit the renewed license tomorrow',
      timestamp: new Date(Date.now() - 43200000),
      sender: 'DRIVER',
      read: true,
    },
    {
      id: '3',
      content: 'Please make sure it is clearly scanned',
      timestamp: new Date(Date.now() - 3600000),
      sender: 'ADMIN',
      read: false,
    },
  ]);

  // Message templates
  const templates = [
    {
      id: 'doc_reminder',
      title: 'Document Reminder',
      content: 'Please submit your updated [document_type] by [date].',
    },
    {
      id: 'verification_success',
      title: 'Verification Success',
      content: 'Your [document_type] has been successfully verified.',
    },
    {
      id: 'verification_failed',
      title: 'Verification Failed',
      content: 'Your [document_type] verification failed. Reason: [reason]',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.content);
    }
    setSelectedTemplate('');
  };

  return (
    <div className="bg-white shadow rounded-lg h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Communication with {driver.firstName} {driver.lastName}
            </h3>
            <p className="text-sm text-gray-500">
              {driver.email} • {driver.phone}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                messages.some((m) => !m.read && m.sender === 'DRIVER')
                  ? 'bg-green-400'
                  : 'bg-gray-400'
              }`}
            />
            <span className="text-sm text-gray-500">
              {messages.some((m) => !m.read && m.sender === 'DRIVER')
                ? 'Online'
                : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="px-6 py-4 h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm rounded-lg px-4 py-2 ${
                  msg.sender === 'ADMIN'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'ADMIN' ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="block w-full rounded-lg border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                onClick={() => setSelectedTemplate('template')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>

        {/* Template Selection */}
        {selectedTemplate && (
          <div className="absolute bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-2">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Message Templates
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCommunication;
