import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  BarChart3, 
  Share2, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Clock,
  X
} from 'lucide-react';
import MIALogo from './MIALogo';
import './Sidebar.css';

const Sidebar = ({ onLogout, chatHistory = [], onChatSelect, onToggleCollapse, isCollapsed }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatHistory, setFilteredChatHistory] = useState(chatHistory);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', active: true },
    { id: 'discover', icon: Search, label: 'Discover' },
  ];

  const recentItems = [
    { id: 'sales', icon: BarChart3, label: 'Sales Analytics' },
    { id: 'social', icon: Share2, label: 'Social Media' },
    { id: 'campaign', icon: MessageSquare, label: 'Campaign Manager' },
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
    setActiveItem(itemId);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-container">
            <MIALogo className="logo-icon" size={60} />
            {!isCollapsed && (
              <div className="logo-text-container">
                <h1 className="logo-title">Marketing Intelligence Agent</h1>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className="collapse-btn"
          onClick={() => onToggleCollapse && onToggleCollapse(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
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
                {recentItems.map((item) => (
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
              <div className="section-header">
                <div className="section-title-group">
                  <h3 className="section-title">CHAT HISTORY</h3>
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
                <span className="chat-count">({filteredChatHistory.length})</span>
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
                            handleItemClick(chat.id);
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
        <button 
          className="nav-item settings-btn"
          onClick={() => handleItemClick('settings')}
        >
          <Settings size={20} className="nav-icon" />
          {!isCollapsed && <span className="nav-label">Settings</span>}
        </button>
        
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={20} className="nav-icon" />
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
