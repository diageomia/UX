import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  BarChart3, 
  Share2, 
  MessageSquare, 
  Info, // Replaced Settings
  LogOut,
  ChevronLeft,
  TrendingUp,
  Menu,
  Clock,
  X
} from 'lucide-react';

import './Sidebar.css';

const Sidebar = ({ onLogout, chatHistory = [], onChatSelect, onToggleCollapse, isCollapsed, onNavigate, currentView, recentTools = [], activeItem: externalActiveItem, onActiveItemChange }) => {
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [internalActiveItem, setInternalActiveItem] = useState('home');
  const activeItem = externalActiveItem || internalActiveItem;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatHistory, setFilteredChatHistory] = useState(chatHistory);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', active: true },
    { id: 'discover', icon: Search, label: 'Discover' },
  ];

  const recentItems = [
    { id: 'brand-analyzer', icon: TrendingUp, label: 'Brand Sentiment Analyzer' },
    { id: 'social-insights', icon: Share2, label: 'Social Media Intelligence' },
  ];

  // Filter chat history based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredChatHistory(chatHistory);
    } else {
      const filtered = chatHistory.filter(chat => 
        chat.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.response.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChatHistory(filtered);
    }
  }, [searchTerm, chatHistory]);

  // Close info tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showInfoTooltip && !event.target.closest('.info-item-wrapper')) {
        setShowInfoTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInfoTooltip]);

  const formatChatLabel = (query) => {
    return query.length > 30 ? query.substring(0, 30) + '...' : query;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const chatTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - chatTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleItemClick = (itemId) => {
    if (onActiveItemChange) {
      onActiveItemChange(itemId);
    } else {
      setInternalActiveItem(itemId);
    }
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-collapsed">
              <img 
                src="/MIA LOOG 2.png" 
                alt="MIA Logo" 
                className={`logo-icon ${isCollapsed ? 'collapsed-logo-icon' : ''}`}
                style={{ 
                  width: isCollapsed ? '40px' : '80px', 
                  height: 'auto'
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="logo-text-container">
                <h1 className="logo-title">Marketing Intelligence Agent</h1>
              </div>
            )}
          </div>
        </div>
        
        {!isCollapsed && (
          <button 
            className="collapse-btn"
            onClick={() => onToggleCollapse && onToggleCollapse(!isCollapsed)}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <item.icon size={20} className="nav-icon" />
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                  {item.id === 'home' && !isCollapsed && (
                    <span className="nav-badge">3</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {!isCollapsed && (
          <>
            <div className="nav-section">
              <h3 className="section-title">RECENT</h3>
              <ul className="nav-list">
                {/* Show most recently visited tools first */}
                {recentTools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      className={`nav-item ${activeItem === tool.id ? 'active' : ''}`}
                      onClick={() => handleItemClick(tool.id)}
                      title={`${tool.name} (${tool.category})`}
                    >
                      {tool.icon && React.cloneElement(tool.icon, { size: 18, className: "nav-icon" })}
                      <span className="nav-label">{tool.name}</span>
                    </button>
                  </li>
                ))}
                {/* Show default items below recent tools (only if not already in recent) */}
                {recentItems
                  .filter((item) => {
                    // Hide default item if it's already in recent tools
                    const isInRecent = recentTools.some(tool => tool.id === `tool-${item.id}`);
                    return !isInRecent;
                  })
                  .map((item) => (
                    <li key={item.id}>
                      <button
                        className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <item.icon size={18} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="nav-section chat-history-section">
              <div className="section-header chat-history-header">
                <div className="section-title-group">
                  <h3 className="section-title">CHAT HISTORY</h3>
                  <span className="chat-count">({filteredChatHistory.length})</span>
                </div>
                <button 
                  className={`search-toggle-btn ${isSearchVisible ? 'active' : ''}`}
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (isSearchVisible) {
                      setSearchTerm('');
                    }
                  }}
                  title={isSearchVisible ? 'Hide search' : 'Search chat history'}
                >
                  <Search size={12} />
                </button>
              </div>
              
              {/* Search Chat History - Conditionally Rendered */}
              {isSearchVisible && (
                <div className="chat-search-container">
                  <div className="search-input-wrapper">
                    <Search size={14} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search chat history..."
                      className="chat-search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    {searchTerm && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => setSearchTerm('')}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Chat History List */}
              <div className="chat-history-list">
                {filteredChatHistory.length > 0 ? (
                  <ul className="nav-list">
                    {filteredChatHistory.map((chat, index) => (
                      <li key={chat.id || index}>
                        <button
                          className={`nav-item chat-item ${activeItem === chat.id ? 'active' : ''}`}
                          onClick={() => {
                            if (onActiveItemChange) {
                              onActiveItemChange(chat.id);
                            } else {
                              setInternalActiveItem(chat.id);
                            }
                            // Navigate to home for chat history items
                            if (onNavigate) {
                              onNavigate('home');
                            }
                            // Load the selected chat
                            onChatSelect && onChatSelect(chat);
                          }}
                          title={chat.query}
                        >
                          <MessageSquare size={16} className="nav-icon" />
                          <div className="chat-item-content">
                            <span className="chat-query">{formatChatLabel(chat.query)}</span>
                            <div className="chat-meta">
                              <Clock size={10} className="time-icon" />
                              <span className="chat-time">{formatTimestamp(chat.timestamp)}</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-chat-history">
                    {searchTerm ? (
                      <div className="no-results">
                        <Search size={20} className="empty-icon" />
                        <p>No chats found</p>
                        <span>Try different keywords</span>
                      </div>
                    ) : (
                      <div className="no-chats">
                        <MessageSquare size={20} className="empty-icon" />
                        <p>No chat history</p>
                        <span>Start a conversation with MIA</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <ul className="nav-list">
          <li className="info-item-wrapper">
            <button className="nav-item" onClick={() => setShowInfoTooltip(!showInfoTooltip)}>
              <Info size={20} className="nav-icon" />
              {!isCollapsed && <span className="nav-label">Info</span>}
            </button>
            {showInfoTooltip && (
              <div className="info-tooltip">
                <div className="tooltip-level-up-header">Stay tuned, our tool is leveling up!</div>
                <h4>About MIA</h4>
                <p>MIA is the gateway to being Diageo marketeer's companion to making faster and smarter decisions. It's designed to provide actionable insights from complex marketing data.</p>
                <h5>Key Features:</h5>
                <ul>
                  <li><strong>KPI Dashboard:</strong> Customizable view of key performance indicators.</li>
                  <li><strong>Critical Attention:</strong> Proactive alerts for important events.</li>
                  <li><strong>MIA Chat:</strong> Conversational interface to query data.</li>
                  <li><strong>Discover:</strong> Explore powerful marketing intelligence tools.</li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <button className="nav-item logout-btn" onClick={onLogout}>
              <LogOut size={20} className="nav-icon" />
              {!isCollapsed && <span className="nav-label">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
