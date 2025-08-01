import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Zap, MessageCircle, Bot } from 'lucide-react';
import MIALogo from './MIALogo';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi Sarah! I'm MIA, your Marketing Intelligence Agent. I can help you analyze campaign performance, understand market trends, and optimize your marketing strategies. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (message) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: message,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('campaign') && lowerMessage.includes('performance')) {
      return "Based on your Q3 campaign data, you're seeing strong performance with a 324% ROI. Your social media campaigns are particularly effective, driving 2.4M engagements. However, I notice a slight dip in social engagement (-8%) last week. Would you like me to analyze the specific factors contributing to this decline?";
    }
    
    if (lowerMessage.includes('competitor') || lowerMessage.includes('analysis')) {
      return "I've identified 3 key competitors making moves in your market space. Brand X launched a similar product line with 15% lower pricing, while Brand Y increased their digital ad spend by 40%. Would you like a detailed competitive analysis report, or should I focus on specific areas like pricing strategy or marketing tactics?";
    }
    
    if (lowerMessage.includes('brand') && lowerMessage.includes('awareness')) {
      return "Your brand awareness is currently at 87% (+12% from last quarter), which is excellent! This growth is primarily driven by your influencer partnerships and content marketing strategy. The strongest awareness metrics are in the 25-34 age group. Should I dive deeper into demographic breakdowns or suggest strategies to maintain this momentum?";
    }
    
    if (lowerMessage.includes('market') && lowerMessage.includes('opportunities')) {
      return "I've identified several promising market opportunities: 1) Emerging market segment in sustainable products (+25% growth), 2) Untapped geographic regions with high engagement rates, 3) Seasonal trends indicating 40% increased demand in Q4. Which opportunity would you like to explore first?";
    }
    
    if (lowerMessage.includes('roi') || lowerMessage.includes('budget')) {
      return "Your current marketing ROI of 324% is exceptional! The highest performing channels are: Email marketing (450% ROI), Social media ads (380% ROI), and Content marketing (290% ROI). For Q4 budget allocation, I recommend increasing spend on email marketing by 20% and testing video content formats. Would you like specific budget recommendations?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! Based on your current marketing data, I can provide insights on campaign performance, competitor analysis, market trends, and budget optimization. Could you be more specific about what you'd like to explore?",
      "I'd be happy to help with that! I have access to your marketing analytics, industry trends, and competitive intelligence. What specific aspect would you like me to analyze?",
      "Let me analyze that for you. I can provide insights on brand awareness, campaign ROI, market opportunities, and consumer behavior patterns. What would be most valuable for you right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Generate AI response
    simulateTyping(generateResponse(inputValue));
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-avatar">
          <MIALogo className="avatar-icon" size={64} />
          <div className="status-indicator"></div>
        </div>
        <div className="chatbot-info">
          <h3 className="chatbot-name">MIA</h3>
          <p className="chatbot-status">
            <div className="online-dot"></div>
            Online • Ready to help
          </p>
        </div>
        <div className="chatbot-actions">
          <button className="action-btn">
            <Sparkles size={16} />
          </button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'bot' ? (
                <div className="bot-avatar">
                  <MIALogo size={40} />
                  <div className="avatar-glow"></div>
                </div>
              ) : (
                <div className="user-avatar">
                  <User size={14} />
                </div>
              )}
            </div>
            
            <div className="message-content">
              <div className="message-bubble">
                <p>{message.content}</p>
              </div>
              <div className="message-timestamp">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing">
            <div className="message-avatar">
              <div className="bot-avatar">
                <MIALogo size={40} />
                <div className="avatar-glow pulsing"></div>
              </div>
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your brand performance, campaigns, or market insights..."
            className="chat-input"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
        
        <div className="input-footer">
          <div className="ai-indicator">
            <Zap size={12} />
            <span>Powered by AI</span>
          </div>
          <div className="chat-stats">
            <MessageCircle size={12} />
            <span>{messages.length} messages</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
