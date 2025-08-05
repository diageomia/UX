import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Users, Target, Smartphone, Palette, MessageSquare, Globe, Share2, DollarSign, Brain } from 'lucide-react';
import './Discover.css';

const Discover = ({ onToolVisit, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'social', label: 'Social Media' },
    { id: 'campaigns', label: 'Campaign Tools' },
    { id: 'insights', label: 'Market Insights' },
    { id: 'automation', label: 'Automation' },
    { id: 'creative', label: 'Creative Tools' }
  ];

  const featuredTools = [
    {
      id: 'brand-analyzer',
      name: 'Brand Sentiment Analyzer',
      description: 'Advanced AI-powered sentiment analysis across all digital channels with real-time monitoring and competitive insights.',
      icon: <TrendingUp size={24} />,
      category: 'Analytics',
      author: 'MIA Intelligence',
      trending: true,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'campaign-optimizer',
      name: 'Campaign Performance Optimizer',
      description: 'Optimize your marketing campaigns with machine learning algorithms that predict and enhance performance metrics.',
      icon: <Target size={24} />,
      category: 'Campaign Tools',
      author: 'Performance Labs',
      trending: false,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'social-insights',
      name: 'Social Media Intelligence',
      description: 'Comprehensive social media analytics with audience insights, engagement tracking, and viral content prediction.',
      icon: <Share2 size={24} />,
      category: 'Social Media',
      author: 'Social Analytics Pro',
      trending: true,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'market-research',
      name: 'Market Research Assistant',
      description: 'AI-powered market research tool that analyzes consumer behavior, market trends, and competitive landscape.',
      icon: <BarChart3 size={24} />,
      category: 'Market Insights',
      author: 'Research Intelligence',
      trending: false,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const allTools = [
    ...featuredTools,
    {
      id: 'audience-segmentation',
      name: 'Audience Segmentation Pro',
      description: 'Create detailed customer segments using advanced demographic and behavioral analysis.',
      icon: <Users size={24} />,
      category: 'Analytics',
      author: 'Segment Analytics',
      trending: false,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 'mobile-engagement',
      name: 'Mobile Engagement Suite',
      description: 'Boost mobile app engagement with push notifications, in-app messaging, and user journey optimization.',
      icon: <Smartphone size={24} />,
      category: 'Automation',
      author: 'Mobile First',
      trending: true,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 'creative-generator',
      name: 'AI Creative Generator',
      description: 'Generate compelling ad copy, social media posts, and marketing content using advanced AI.',
      icon: <Palette size={24} />,
      category: 'Creative Tools',
      author: 'Creative AI',
      trending: false,
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      id: 'conversation-ai',
      name: 'Customer Conversation AI',
      description: 'Intelligent chatbot that handles customer inquiries with context-aware responses.',
      icon: <MessageSquare size={24} />,
      category: 'Automation',
      author: 'Conversation Pro',
      trending: true,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      id: 'global-trends',
      name: 'Global Market Trends',
      description: 'Track worldwide market trends, consumer preferences, and emerging opportunities.',
      icon: <Globe size={24} />,
      category: 'Market Insights',
      author: 'Global Insights',
      trending: false,
      gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    },
    {
      id: 'roi-calculator',
      name: 'ROI Impact Calculator',
      description: 'Calculate and predict ROI for marketing campaigns with advanced attribution modeling.',
      icon: <DollarSign size={24} />,
      category: 'Analytics',
      author: 'ROI Analytics',
      trending: false,
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics Engine',
      description: 'Forecast market trends, customer behavior, and campaign performance using machine learning.',
      icon: <Brain size={24} />,
      category: 'Analytics',
      author: 'Predictive Labs',
      trending: true,
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    },
    {
      id: 'competitor-tracker',
      name: 'Competitor Intelligence',
      description: 'Monitor competitor activities, pricing strategies, and market positioning in real-time.',
      icon: <Target size={24} />,
      category: 'Market Insights',
      author: 'Competitive Edge',
      trending: false,
      gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)'
    }
  ];

  // Handle tool interaction (click/integrate)
  const handleToolInteraction = (tool) => {
    if (onToolVisit) {
      onToolVisit(tool);
    }
    // Navigate to tool page
    if (onNavigate) {
      onNavigate(`tool-${tool.id}`);
    }
  };

  // Dynamic category count calculation
  const getCategoryCount = (categoryId, categoryLabel) => {
    let tools;
    
    if (categoryId === 'all') {
      tools = allTools;
    } else {
      tools = allTools.filter(tool => tool.category === categoryLabel);
    }
    
    // Apply search filter if search term exists
    if (searchTerm) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return tools.length;
  };

  const getFilteredTools = () => {
    let tools = allTools;
    
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.label;
      if (categoryName && selectedCategory !== 'all') {
        tools = tools.filter(tool => tool.category === categoryName);
      }
    }

    if (searchTerm) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return tools;
  };

  const getTrendingTools = () => {
    return allTools.filter(tool => tool.trending).slice(0, 3);
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <div className="discover-title-section">
          <h1 className="discover-title">Discover Marketing Tools</h1>
          <p className="discover-subtitle">
            Explore marketing intelligence tools that enhance your campaigns, analyze performance, and drive better results.
          </p>
        </div>
        
        <div className="discover-search">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search tools..."
              className="discover-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="discover-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
            <span className="category-count">{getCategoryCount(category.id, category.label)}</span>
          </button>
        ))}
      </div>

      <div className="discover-content">
        {selectedCategory === 'all' && !searchTerm && (
          <div className="featured-section">
            {/* All Available Tools Section - Now First */}
            <div className="all-tools-section">
              <div className="section-header">
                <h2 className="section-title">All Available Tools</h2>
                <p className="section-subtitle">{allTools.length} marketing intelligence tools</p>
              </div>
              
              <div className="tools-grid">
                {allTools.map((tool) => (
                  <div 
                    key={`all-${tool.id}`} 
                    className="tool-card clickable"
                    onClick={() => handleToolInteraction(tool)}
                  >
                    <div className="tool-card-header">
                      <div className="tool-icon" style={{ background: tool.gradient }}>
                        {tool.icon}
                      </div>
                    </div>
                    <div className="tool-card-content">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-meta">
                        <span className="tool-category">{tool.category}</span>
                        <span className="tool-author">By {tool.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Tools Section - Now Second */}
            <div className="featured-tools-section">
              <div className="section-header">
                <h2 className="section-title">Featured Tools</h2>
                <p className="section-subtitle">Curated top picks for marketing intelligence</p>
              </div>
              
              <div className="tools-grid featured-grid">
                {featuredTools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="tool-card featured-card clickable"
                    onClick={() => handleToolInteraction(tool)}
                  >
                    <div className="tool-card-header">
                      <div className="tool-icon" style={{ background: tool.gradient }}>
                        {tool.icon}
                      </div>
                      {tool.trending && <div className="trending-badge">Trending</div>}
                    </div>
                    <div className="tool-card-content">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-meta">
                        <span className="tool-category">{tool.category}</span>
                        <span className="tool-author">By {tool.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Section - Now Third */}
            <div className="trending-section">
              <div className="section-header">
                <h2 className="section-title">Trending This Week</h2>
                <p className="section-subtitle">Most popular tools among Brand Managers</p>
              </div>
              
              <div className="tools-grid trending-grid">
                {getTrendingTools().map((tool) => (
                  <div 
                    key={`trending-${tool.id}`} 
                    className="tool-card trending-card clickable"
                    onClick={() => handleToolInteraction(tool)}
                  >
                    <div className="tool-card-header">
                      <div className="tool-icon" style={{ background: tool.gradient }}>
                        {tool.icon}
                      </div>
                      <div className="trending-badge">🔥 Trending</div>
                    </div>
                    <div className="tool-card-content">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-meta">
                        <span className="tool-category">{tool.category}</span>
                        <span className="tool-author">By {tool.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(selectedCategory !== 'all' || searchTerm) && (
          <div className="tools-section">
            <div className="section-header">
              <h2 className="section-title">
                {searchTerm ? `Search Results for "${searchTerm}"` : categories.find(cat => cat.id === selectedCategory)?.label || 'All Tools'}
              </h2>
              <p className="section-subtitle">
                {getFilteredTools().length} tool{getFilteredTools().length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            {getFilteredTools().length === 0 ? (
              <div className="no-results">
                <Search size={48} className="no-results-icon" />
                <h3>No tools found</h3>
                <p>Try adjusting your search terms or browse different categories</p>
              </div>
            ) : (
              <div className="tools-grid">
                {getFilteredTools().map((tool) => (
                  <div 
                    key={tool.id} 
                    className="tool-card clickable"
                    onClick={() => handleToolInteraction(tool)}
                  >
                    <div className="tool-card-header">
                      <div className="tool-icon" style={{ background: tool.gradient }}>
                        {tool.icon}
                      </div>
                      {tool.trending && <div className="trending-badge">Trending</div>}
                    </div>
                    <div className="tool-card-content">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-meta">
                        <span className="tool-category">{tool.category}</span>
                        <span className="tool-author">By {tool.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
