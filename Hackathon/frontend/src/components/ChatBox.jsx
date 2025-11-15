import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';

const ChatBox = ({ userId, sessionType, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = getSocket();

    // Start session
    if (sessionType === 'assessment') {
      socketRef.current.emit('start-assessment', { userId });
    } else if (sessionType === 'wellness') {
      socketRef.current.emit('start-wellness-check', { userId });
    }

    // Listen for assistant messages
    socketRef.current.on('assistant-message', (data) => {
      setMessages(prev => [...prev, { role: 'assistant', text: data.message }]);
      setIsTyping(false);
    });

    // Listen for assessment complete
    socketRef.current.on('assessment-complete', (data) => {
      setIsTyping(false);
      if (onComplete) {
        onComplete(data);
      }
    });

    // Listen for wellness complete
    socketRef.current.on('wellness-complete', (data) => {
      setIsTyping(false);
      if (onComplete) {
        onComplete(data);
      }
    });

    // Listen for errors
    socketRef.current.on('error', (error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        text: 'Sorry, something went wrong. Please try again.'
      }]);
      setIsTyping(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('assistant-message');
        socketRef.current.off('assessment-complete');
        socketRef.current.off('wellness-complete');
        socketRef.current.off('error');
      }
    };
  }, [userId, sessionType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setInput('');

    // Send to server
    if (sessionType === 'assessment') {
      socketRef.current.emit('user-message', { message: input });
    } else if (sessionType === 'wellness') {
      socketRef.current.emit('wellness-response', { message: input });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : msg.role === 'system'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
