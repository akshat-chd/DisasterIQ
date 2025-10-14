// src/components/ChatbotWidget.jsx

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// Simple rule-based "brain" for the chatbot
const getBotResponse = (message) => {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return 'Hello! How can I help you with disaster safety today?';
  }
  if (msg.includes('earthquake')) {
    return 'For earthquakes: Drop, Cover, and Hold On. Stay away from windows and heavy furniture.';
  }
  if (msg.includes('cyclone')) {
    return 'For cyclones: Stay indoors, away from windows. Monitor official broadcasts and have an emergency kit ready.';
  }
  if (msg.includes('flood')) {
    return 'For floods: Move to higher ground immediately. Do not walk or drive through floodwaters.';
  }
  if (msg.includes('help')) {
    return 'You can ask me for safety tips about earthquakes, cyclones, or floods.';
  }
  return "I'm sorry, I can only provide basic safety tips for earthquakes, cyclones, and floods. For more help, please contact local authorities.";
};


export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am a safety bot. Ask me for tips on earthquakes, cyclones, or floods.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // The logic is now simple and synchronous
    const userMessage = { sender: 'user', text: inputValue };
    const botMessage = { sender: 'bot', text: getBotResponse(inputValue) };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Safety Bot</h3>
            <button onClick={() => setIsOpen(false)}><X size={18}/></button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for safety tips..."
            />
            <button type="submit"><Send size={16} /></button>
          </form>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}