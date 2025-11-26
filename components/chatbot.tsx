"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function RecipeChatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Frontend error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-zinc-900 rounded-xl text-white w-full max-w-4xl h-[600px] flex flex-col shadow-2xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-zinc-700">
          <h3 className="text-xl font-bold text-center">🍳 Recipe Assistant</h3>
          <p className="text-sm text-zinc-400 text-center mt-1">Ask for recipes and cooking advice</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-400 mt-16">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-lg mb-2">Hi! I'm your recipe assistant.</p>
              <p className="text-sm">Ask me for recipes like "high protein lunch, no mushrooms"</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.isUser
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-zinc-700 text-white rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                <div className={`text-xs mt-2 opacity-70 ${
                  msg.isUser ? 'text-green-100' : 'text-zinc-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-700 p-4 rounded-2xl rounded-bl-md">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-sm">Cooking up a response...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-600 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-zinc-700 bg-zinc-800 rounded-b-xl">
          <div className="space-y-3">
            <textarea
              className="w-full p-4 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              rows={3}
              placeholder="Ask for a recipe..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-400">Press Enter to send, Shift+Enter for new line</p>
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 