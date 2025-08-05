import React, { useState, useEffect, useRef } from 'react';
import { Send, TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Share2, AlertTriangle, ChevronDown, ChevronUp, Bell, Search, Clock, User, Plus, Paperclip, MessageSquarePlus, Menu, X, RotateCcw, Copy, ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react';

import './Dashboard.css';
import Sidebar from './Sidebar';
import MetricCard from './MetricCard';
import AlertCard from './AlertCard';
import Discover from './Discover';
import UserProfile from './UserProfile';

const Dashboard = ({ onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  // Conversation messages for chat-like interface
  const [conversation, setConversation] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [likedMessages, setLikedMessages] = useState(new Set());
  const [dislikedMessages, setDislikedMessages] = useState(new Set());
  const [copiedMessages, setCopiedMessages] = useState(new Set());
  const [bookmarkedMessages, setBookmarkedMessages] = useState(new Set());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Smith',
    role: 'Brand Manager',
    mode: 'light'
  });
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [animatingButtons, setAnimatingButtons] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [kpiSearchTerm, setKpiSearchTerm] = useState('');
  const [selectedKpiCategory, setSelectedKpiCategory] = useState('all');
  // Track which KPIs have been selected in the modal before confirming
  const [selectedKpiIds, setSelectedKpiIds] = useState([]);
  // View management
  const [currentView, setCurrentView] = useState('home');
  // Recent tools tracking
  const [recentTools, setRecentTools] = useState([]);
  // Active item in sidebar
  const [activeItem, setActiveItem] = useState('home');
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'campaign',
      title: 'Q4 Holiday Campaign Performance',
      message: 'Your holiday campaign exceeded targets by 23%. ROI increased to 445%.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'budget',
      title: 'Budget Approval Required',
      message: 'Q1 2024 marketing budget requires your approval by Friday.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'social',
      title: 'Social Media Milestone',
      message: 'Your brand mentions reached 15K this week - a new record!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'competitor',
      title: 'Competitor Analysis Update',
      message: 'New competitor pricing strategy detected. Analysis report ready.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'system',
      title: 'Weekly Performance Report',
      message: 'Your weekly marketing performance report is now available.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      priority: 'low'
    }
  ]);

  const modes = [
    { id: 'light', name: 'Light Mode', description: 'Clean and bright interface', icon: '☀️' },
    { id: 'dark', name: 'Dark Mode', description: 'Easy on the eyes for low-light environments', icon: '🌙' },
    { id: 'colorblind', name: 'Color Blind', description: 'Optimized for color vision accessibility', icon: '🎨' },
  ];
  
  // Enhanced KPI data with values, changes, and categories - Only specified KPIs
  const availableKpis = {
    brandAwareness: [
      { 
        id: 'brand_sentiment', 
        name: 'Brand Sentiment', 
        category: 'Brand & Awareness',
        description: 'Overall sentiment analysis across all channels',
        value: '78%',
        change: '+5%',
        trend: 'up',
        recommended: true
      },
      { 
        id: 'brand_mentions', 
        name: 'Brand Mentions', 
        category: 'Brand & Awareness',
        description: 'Total mentions across social media and web',
        value: '12.4K',
        change: '+18%',
        trend: 'up',
        popular: true
      },
      { 
        id: 'share_of_voice', 
        name: 'Share of Voice', 
        category: 'Brand & Awareness',
        description: 'Brand visibility vs competitors',
        value: '23%',
        change: '+3%',
        trend: 'up'
      }
    ],
    performanceROI: [
      { 
        id: 'customer_acquisition_cost', 
        name: 'Customer Acquisition Cost', 
        category: 'Performance & ROI',
        description: 'Average cost to acquire a new customer',
        value: '$45',
        change: '-12%',
        trend: 'down',
        recommended: true
      },
      { 
        id: 'conversion_rate', 
        name: 'Conversion Rate', 
        category: 'Performance & ROI',
        description: 'Percentage of visitors who convert',
        value: '3.2%',
        change: '-0.8%',
        trend: 'down',
        popular: true
      },
      { 
        id: 'customer_lifetime_value', 
        name: 'Customer Lifetime Value', 
        category: 'Performance & ROI',
        description: 'Average revenue per customer over time',
        value: '$1,250',
        change: '+15%',
        trend: 'up'
      }
    ],
    socialEngagement: [
      { 
        id: 'social_reach', 
        name: 'Social Reach', 
        category: 'Social & Engagement',
        description: 'Total reach across all social platforms',
        value: '850K',
        change: '+22%',
        trend: 'up',
        popular: true
      },
      { 
        id: 'engagement_quality', 
        name: 'Engagement Quality', 
        category: 'Social & Engagement',
        description: 'Meaningful interactions vs total engagement',
        value: '85%',
        change: '+7%',
        trend: 'up',
        recommended: true
      },
      { 
        id: 'influencer_impact', 
        name: 'Influencer Impact', 
        category: 'Social & Engagement',
        description: 'ROI from influencer partnerships',
        value: '420%',
        change: '+35%',
        trend: 'up'
      }
    ],
    digitalWeb: [
      { 
        id: 'website_traffic', 
        name: 'Website Traffic', 
        category: 'Digital & Web',
        description: 'Unique visitors to your website',
        value: '125K',
        change: '+8%',
        trend: 'up',
        popular: true
      },
      { 
        id: 'bounce_rate', 
        name: 'Bounce Rate', 
        category: 'Digital & Web',
        description: 'Percentage of single-page sessions',
        value: '32%',
        change: '-5%',
        trend: 'down'
      }
    ]
  };

  // Get KPIs based on selected category
  const getFilteredKpis = () => {
    const term = kpiSearchTerm.trim().toLowerCase();
    let kpisToShow = [];

    if (selectedKpiCategory === 'all') {
      kpisToShow = [
        ...availableKpis.brandAwareness,
        ...availableKpis.performanceROI,
        ...availableKpis.socialEngagement,
        ...availableKpis.digitalWeb
      ];
    } else if (selectedKpiCategory === 'brand') {
      kpisToShow = availableKpis.brandAwareness;
    } else if (selectedKpiCategory === 'performance') {
      kpisToShow = availableKpis.performanceROI;
    } else if (selectedKpiCategory === 'social') {
      kpisToShow = availableKpis.socialEngagement;
    } else if (selectedKpiCategory === 'digital') {
      kpisToShow = availableKpis.digitalWeb;
    }

    if (!term) {
      return kpisToShow;
    }

    return kpisToShow.filter(kpi =>
      kpi.name.toLowerCase().includes(term)
    );
  };

  // Category counts
  const getCategoryCount = (category) => {
    let slice = [];
    switch (category) {
      case 'all':
        slice = Object.values(availableKpis).flat();
        break;
      case 'brand':
        slice = availableKpis.brandAwareness;
        break;
      case 'performance':
        slice = availableKpis.performanceROI;
        break;
      case 'social':
        slice = availableKpis.socialEngagement;
        break;
      case 'digital':
        slice = availableKpis.digitalWeb;
        break;
      default:
        slice = [];
    }
    if (!kpiSearchTerm.trim()) {
      return slice.length;
    }
    const term = kpiSearchTerm.trim().toLowerCase();
    return slice.filter(kpi =>
      kpi.name.toLowerCase().includes(term)
    ).length;
  };
  
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'sample1',
      query: 'Show me which campaigns delivered the highest ROI and why?',
      response: "Here's your ROI breakdown for this quarter's top performers...",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      metrics: ['450% email ROI', '380% retargeting ROI', '290% search ROI']
    },
    {
      id: 'sample2', 
      query: 'What drove the 12% increase in brand awareness this quarter?',
      response: "Great question! Your brand awareness surge this quarter was driven by three key factors...",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      metrics: ['2.3M impressions', '47% higher engagement', '340% organic increase']
    },
    {
      id: 'sample3',
      query: 'performance',
      response: "Your overall marketing performance is strong with room for optimization...",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      metrics: ['8.2/10 score', '324% ROI', '87% awareness']
    }
  ]);
  const responseRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close user profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Handle profile updates
  const handleUpdateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    // Apply theme changes if theme was updated
    if (updates.theme) {
      applyTheme(updates.theme);
    }
  };

  const handleModeChange = (modeId) => {
    setUserProfile(prev => ({ ...prev, mode: modeId }));
    applyMode(modeId);
  };

  // Apply mode to document
  const applyMode = (modeId) => {
    const mode = modes.find(m => m.id === modeId) || modes[0];
    // Remove existing mode classes
    document.documentElement.classList.remove('light-mode', 'dark-mode', 'colorblind-mode');
    // Add new mode class
    document.documentElement.classList.add(`${modeId}-mode`);
  };

  // Extract prompts from bookmarked messages
  useEffect(() => {
    const prompts = bookmarks.map(bookmark => ({
      id: bookmark.id,
      text: bookmark.query || 'Bookmarked prompt',
      savedAt: bookmark.savedAt
    }));
    setSavedPrompts(prompts);
  }, [bookmarks]);

  // Remove saved prompt
  const handleRemovePrompt = (promptId) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== promptId));
    // Also remove from bookmarks if it exists
    setBookmarks(prev => prev.filter(b => b.id !== promptId));
  };

  // Helper function to trigger button animation
  const triggerButtonAnimation = (buttonId) => {
    setAnimatingButtons(prev => new Set([...prev, buttonId]));
    setTimeout(() => {
      setAnimatingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(buttonId);
        return newSet;
      });
    }, 600); // Animation duration
  };

  // KPI prompts mapping
  const kpiPrompts = {
    'Brand Awareness': 'What drove the 12% increase in brand awareness this quarter?',
    'Campaign ROI': 'Show me which campaigns delivered the highest ROI and why?',
    'Social Engagement': 'Why did social engagement drop 8% and how can we recover?',
    'Market Share': 'Analyze our market share growth and identify expansion opportunities?'
  };

  const [kpis, setKpis] = useState([
    {
      id: 'brand_awareness',
      title: 'Brand Awareness',
      value: '87%',
      change: '+12%',
      trend: 'up',
      color: '#10b981',
      icon: TrendingUp,
      removable: true
    },
    {
      id: 'campaign_roi',
      title: 'Campaign ROI',
      value: '324%',
      change: '+45%',
      trend: 'up',
      color: '#3b82f6',
      icon: BarChart3,
      removable: true
    },
    {
      id: 'social_engagement',
      title: 'Social Engagement',
      value: '2.4M',
      change: '-8%',
      trend: 'down',
      color: '#ef4444',
      icon: Share2,
      removable: true
    }

  ]);

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Q4 campaign budget needs approval by Friday',
      timeAgo: '2 days',
      priority: 'HIGH',
      prompt: 'Help me prepare the Q4 budget proposal with ROI projections?'
    },
    {
      id: 2,
      type: 'medium',
      title: 'Competitor launched similar product - analysis needed',
      timeAgo: '1 week',
      priority: 'MEDIUM',
      prompt: 'Analyze the competitor\'s new product launch and our response strategy?'
    }
  ];

  const suggestedPrompts = [
    'Competitor pricing analysis',
    'Q4 campaign ideas',
    'Brand sentiment trends',
    'Market opportunities'
  ];

  // Handle KPI card clicks
  const handleKpiClick = (kpiTitle) => {
    const prompt = kpiPrompts[kpiTitle];
    if (prompt) {
      setSearchQuery(prompt);
      setConversation([]); // Start fresh conversation
      // Scroll to MIA section
      document.querySelector('.chat-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Handle suggested prompt clicks
  const handlePromptClick = (prompt) => {
    setSearchQuery(prompt);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle new chat
  // Handle attachment (placeholder for future functionality)
  const handleAttachment = () => {
    // Placeholder for file attachment functionality
    console.log('Attachment feature - coming soon!');
  };

  // AI Response mapping
  const getAIResponse = (query) => {
    const responses = {
      'What drove the 12% increase in brand awareness this quarter?': {
        text: "Great question! Your brand awareness surge this quarter was driven by three key factors:\n\n🎯 **Influencer Partnerships** (+5% impact)\n• Partnership with 15 micro-influencers in your target demographic\n• Generated 2.3M authentic impressions\n• 47% higher engagement than traditional ads\n\n📱 **Social Media Strategy** (+4% impact)\n• User-generated content campaign #MyBrandStory\n• 340% increase in organic shares\n• Video content performed 3x better than static posts\n\n🎥 **Content Marketing** (+3% impact)\n• Educational video series launched\n• 89% completion rate on how-to content\n• SEO ranking improved for 200+ keywords\n\n**Recommendation**: Double down on micro-influencer partnerships for Q4, as they're delivering the highest ROI at $2.30 per impression.",
        metrics: ['2.3M impressions', '47% higher engagement', '340% organic increase']
      },
      'Show me which campaigns delivered the highest ROI and why?': {
        text: "Here's your ROI breakdown for this quarter's top performers:\n\n🥇 **Email Marketing Campaign** - 450% ROI\n• Personalized product recommendations\n• 28% open rate, 12% click-through rate\n• $45 average order value\n• Cost: $2,500 | Revenue: $11,250\n\n🥈 **Social Media Retargeting** - 380% ROI\n• Facebook/Instagram pixel optimization\n• Targeted cart abandoners within 24 hours\n• 23% conversion rate\n• Cost: $3,200 | Revenue: $12,160\n\n🥉 **Google Ads - Long-tail Keywords** - 290% ROI\n• Focus on specific product searches\n• Lower competition, higher intent\n• 18% conversion rate\n• Cost: $4,100 | Revenue: $11,890\n\n**Key Success Factors**: Personalization, precise timing, and intent-based targeting are your ROI multipliers.",
        metrics: ['450% email ROI', '380% retargeting ROI', '290% search ROI']
      },
      'Why did social engagement drop 8% and how can we recover?': {
        text: "I've analyzed your social engagement decline. Here's what happened and the recovery plan:\n\n📉 **Root Causes of 8% Drop**:\n• Algorithm changes on Instagram (-12% reach)\n• Reduced posting frequency (from 5 to 3 posts/week)\n• Less video content (down 40% from last quarter)\n• Competitor increased ad spend by 60%\n\n🚀 **Recovery Strategy**:\n\n**Immediate Actions (Week 1-2)**:\n• Increase video content to 60% of posts\n• Launch Instagram Reels challenge\n• Engage with followers within 2 hours of posting\n\n**Medium-term (Month 1-2)**:\n• Partner with 5 new micro-influencers\n• Create 'behind-the-scenes' content series\n• Implement user-generated content rewards\n\n**Expected Results**: 15% engagement recovery within 6 weeks based on similar strategies.",
        metrics: ['40% less video content', '60% competitor increase', '15% recovery target']
      },
      'Analyze our market share growth and identify expansion opportunities?': {
        text: "Your market position is strong with clear expansion paths ahead:\n\n📊 **Current Market Analysis**:\n• Market share: 15.2% (+2.1% growth)\n• Total addressable market: $2.4B\n• Your segment revenue: $365M\n• Growth rate: 3x industry average\n\n🎯 **Top Expansion Opportunities**:\n\n**1. Geographic Expansion** (Potential: +5% share)\n• West Coast markets show 40% less competition\n• Similar demographics to current strongholds\n• Estimated revenue: +$120M\n\n**2. Product Line Extension** (Potential: +3% share)\n• Adjacent category analysis shows 67% customer interest\n• Premium segment is underserved\n• Estimated revenue: +$72M\n\n**3. B2B Channel Development** (Potential: +2% share)\n• Enterprise sales opportunity identified\n• 23% higher margins than B2C\n• Estimated revenue: +$48M\n\n**Recommended Priority**: Start with geographic expansion as it requires lowest investment with highest certainty.",
        metrics: ['$2.4B total market', '+5% geographic potential', '67% product interest']
      },
      'Competitor pricing analysis': {
        text: "Here's your competitive pricing landscape analysis:\n\n💰 **Pricing Position Overview**:\n• You're positioned 8% above market average\n• Premium justified by 23% higher quality scores\n• Customer willingness to pay: 12% price premium\n\n🏆 **Competitor Breakdown**:\n\n**Direct Competitors**:\n• CompetitorA: 15% below your price, 31% lower quality\n• CompetitorB: 3% above your price, similar quality\n• CompetitorC: 22% below, targeting budget segment\n\n**Pricing Opportunities**:\n• Bundle pricing could increase AOV by 18%\n• Subscription model shows 34% higher lifetime value\n• Regional pricing could capture price-sensitive segments\n\n**Strategic Recommendation**: Maintain premium pricing but introduce value tier to capture 25% more market share.",
        metrics: ['8% price premium', '23% quality advantage', '34% subscription value']
      },
      'Q4 campaign ideas': {
        text: "Here are data-driven Q4 campaign concepts tailored to your audience:\n\n🎄 **Holiday Season Campaigns**:\n\n**1. 'Gift Guide Genius'** - Personalized Recommendations\n• AI-powered gift suggestions based on purchase history\n• Expected 35% higher conversion than generic promotions\n• Interactive quiz format for engagement\n\n**2. '12 Days of Brand Joy'** - Daily Surprise Campaign\n• Limited-time offers building anticipation\n• Social media countdown creating FOMO\n• Expected 28% increase in daily engagement\n\n**3. 'Year in Review'** - Customer Success Stories\n• Personalized impact reports for customers\n• User-generated content amplification\n• Builds emotional connection for retention\n\n**Budget Allocation Recommendation**:\n• 40% on Gift Guide (highest ROI potential)\n• 35% on 12 Days campaign (brand awareness)\n• 25% on Year in Review (customer loyalty)",
        metrics: ['35% gift guide conversion', '28% engagement boost', '40% budget allocation']
      },
      'Brand sentiment trends': {
        text: "Your brand sentiment analysis reveals positive momentum with key insights:\n\n😊 **Overall Sentiment Score: 78/100** (+12 points QoQ)\n\n📈 **Positive Trends**:\n• Customer service mentions: 89% positive\n• Product quality discussions: 84% positive\n• Brand values alignment: 76% positive\n\n⚠️ **Areas for Attention**:\n• Pricing discussions: 34% negative sentiment\n• Shipping experience: 28% neutral (improvement opportunity)\n• Mobile app: 23% negative feedback\n\n🎯 **Sentiment Drivers**:\n• Sustainability initiatives boosted sentiment 15%\n• Recent product launch received 91% positive reviews\n• Customer support response time improvements noted\n\n**Action Items**:\n1. Address pricing perception with value communication\n2. Improve mobile app user experience\n3. Enhance shipping communication and tracking",
        metrics: ['78/100 sentiment', '+12 points growth', '91% launch positivity']
      },
      'Market opportunities': {
        text: "I've identified high-potential market opportunities based on current trends:\n\n🚀 **Emerging Opportunities**:\n\n**1. Sustainable Products Segment** (🔥 Hot)\n• 156% growth in sustainable product searches\n• 67% of your audience willing to pay 15% premium\n• Competition is 40% less established\n• Estimated market size: $180M\n\n**2. Mobile-First Experience** (📱 Growing)\n• 73% of purchases now mobile-initiated\n• Your mobile conversion: 2.3% vs industry 3.8%\n• Optimization could capture additional $2.1M revenue\n\n**3. Subscription Economy** (💼 Stable Growth)\n• 45% customer interest in subscription model\n• Higher lifetime value: 3.2x vs one-time purchases\n• Predictable revenue stream opportunity\n\n**Market Entry Strategy**:\n• Phase 1: Sustainable product line (6 months)\n• Phase 2: Mobile optimization (3 months)\n• Phase 3: Subscription pilot (9 months)\n\n**Expected ROI**: 240% within 18 months across all initiatives.",
        metrics: ['156% sustainable growth', '3.2x subscription value', '240% expected ROI']
      },
      // Alternative responses for testing variety
      'brand awareness': {
        text: "Your brand awareness metrics show strong performance across multiple channels:\n\n📊 **Current Performance**: 87% (↑12% QoQ)\n\n🎯 **Key Drivers**:\n• Influencer collaborations: 2.3M reach\n• Viral social content: #BrandChallenge\n• PR coverage: 45 media mentions\n• SEO improvements: 200+ keyword rankings\n\n📈 **Growth Trajectory**:\n• Q1: 75% → Q2: 87% (+12%)\n• Projected Q3: 92% (+5%)\n• Target Q4: 95% (+3%)\n\n**Next Steps**: Focus on conversion optimization to capitalize on increased awareness.",
        metrics: ['87% awareness', '45 media mentions', '2.3M reach']
      },
      'campaign roi': {
        text: "Your campaign ROI performance demonstrates excellent strategic execution:\n\n💰 **Overall ROI**: 324% (Industry avg: 180%)\n\n🏆 **Top Performers**:\n• Email campaigns: 450% ROI\n• Social retargeting: 380% ROI\n• Search campaigns: 290% ROI\n• Display ads: 220% ROI\n\n📊 **Investment Breakdown**:\n• Total spend: $28,500\n• Revenue generated: $92,340\n• Net profit: $63,840\n\n🎯 **Optimization Opportunities**:\n• Reallocate 20% budget from display to email\n• Increase retargeting frequency\n• Test video ad formats\n\n**Projected Impact**: +15% ROI improvement possible.",
        metrics: ['324% total ROI', '$92,340 revenue', '+15% improvement']
      },
      'social engagement': {
        text: "Social engagement analysis reveals both challenges and opportunities:\n\n📱 **Current Status**: 2.4M engagements (↓8% from last quarter)\n\n📉 **Decline Factors**:\n• Instagram algorithm changes\n• Reduced video content (40% decrease)\n• Increased competition (60% more ad spend)\n• Lower posting frequency\n\n💡 **Recovery Strategy**:\n• Double video content production\n• Launch TikTok presence\n• Implement employee advocacy program\n• Create interactive polls/quizzes\n\n📈 **Expected Recovery**: 15% increase within 6 weeks\n\n**Quick Win**: Partner with 3 micro-influencers this month for immediate boost.",
        metrics: ['2.4M engagements', '40% video decrease', '15% recovery target']
      },
      'market share': {
        text: "Market share analysis shows strong competitive positioning:\n\n🎯 **Current Position**: 15.2% (+2.1% YoY growth)\n\n🏆 **Competitive Landscape**:\n• Rank: #3 in category\n• Growing 3x faster than industry\n• Premium segment leader\n• Geographic concentration: East Coast (65%)\n\n🚀 **Expansion Opportunities**:\n• West Coast: 40% less competition\n• International: Canada/UK markets\n• Adjacent categories: 67% customer interest\n• B2B segment: Untapped potential\n\n💰 **Revenue Impact**:\n• Geographic expansion: +$120M\n• Product extension: +$72M\n• B2B development: +$48M\n\n**Strategic Priority**: Geographic expansion offers highest ROI with lowest risk.",
        metrics: ['15.2% market share', '+$240M potential', '3x growth rate']
      },
      // Quick test responses for common queries
      'hello': {
        text: "Hello! I'm MIA, your Marketing Intelligence Agent. I'm here to help you analyze your brand performance, campaigns, and market insights. \n\n🚀 **What I can help with:**\n• Brand awareness analysis\n• Campaign ROI optimization\n• Social engagement strategies\n• Market share insights\n• Competitive analysis\n• Growth opportunities\n\nTry clicking on one of the metric cards above or ask me a specific question!",
        metrics: ['Real-time analysis', 'Data-driven insights', 'Strategic recommendations']
      },
      'help': {
        text: "🤖 **MIA Help Center**\n\nI can provide insights on:\n\n📊 **Performance Metrics**\n• Brand awareness trends\n• Campaign ROI analysis\n• Social engagement metrics\n• Market share positioning\n\n🎯 **Strategic Analysis**\n• Competitive landscape\n• Growth opportunities\n• Customer behavior insights\n• Market trends\n\n💡 **Quick Tips**:\n• Click metric cards for instant analysis\n• Use suggested prompts for common queries\n• Ask specific questions for detailed insights\n\n**Example**: 'How can we improve our social engagement?'",
        metrics: ['Available 24/7', 'Data-driven', 'Actionable insights']
      },
      'performance': {
        text: "Your overall marketing performance is strong with room for optimization:\n\n📈 **Key Performance Indicators:**\n• Brand Awareness: 87% (↑12% QoQ)\n• Campaign ROI: 324% (vs 180% industry avg)\n• Social Engagement: 2.4M (↓8% QoQ)\n• Market Share: 15.2% (↚2.1% YoY)\n\n🎯 **Performance Score: 8.2/10**\n\n🚀 **Top Strengths:**\n• Exceptional ROI performance\n• Strong brand recognition growth\n• Market position improving\n\n⚠️ **Areas for Improvement:**\n• Social engagement declining\n• Video content gaps\n• Mobile optimization needed\n\n**Next Actions**: Focus on social recovery and mobile optimization for maximum impact.",
        metrics: ['8.2/10 score', '324% ROI', '87% awareness']
      }
    };

    return responses[query] || {
      text: "I understand you're looking for insights about that topic. Based on your data, I can provide a comprehensive analysis. Could you please be more specific about what aspect you'd like me to focus on? I can help with:\n\n• Performance metrics and KPIs\n• Competitive analysis\n• Growth opportunities\n• Campaign optimization\n• Market trends\n• Customer behavior insights\n\nWhat would be most valuable for your current objectives?",
      metrics: ['Available insights', 'Custom analysis', 'Data-driven recommendations']
    };
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Add user message to conversation immediately
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: searchQuery,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, userMessage]);
      
      // Clear search input and set loading
      const currentQuery = searchQuery;
      setSearchQuery('');
      setIsLoading(true);
      setAiResponse('');
      
      // Simulate AI response delay
      setTimeout(() => {
        const response = getAIResponse(currentQuery);
        
        // Add AI response to conversation
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.text,
          metrics: response.metrics,
          timestamp: new Date().toISOString()
        };
        
        setConversation(prev => [...prev, aiMessage]);
        setIsLoading(false);
        
        // Smooth scroll to show both latest chat and search input
        setTimeout(() => {
          const searchContainer = document.querySelector('.mia-search-container');
          if (searchContainer) {
            searchContainer.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end',
              inline: 'nearest'
            });
          }
        }, 100);
        
        // Add to legacy chat history for sidebar
        const newChatItem = {
          id: Date.now().toString(),
          query: currentQuery,
          response: response.text,
          timestamp: new Date().toISOString(),
          metrics: response.metrics
        };
        
        setChatHistory(prev => [newChatItem, ...prev]);
      }, 2000);
    }
  };
  
  // Handle KPI modal functions
  const openKpiModal = () => {
    setIsKpiModalOpen(true);
    setKpiSearchTerm('');
  };
  
  const closeKpiModal = () => {
    setIsKpiModalOpen(false);
    setKpiSearchTerm('');
  };
  
  // Toggle KPI selection inside the modal
  const handleKpiSelect = (kpi) => {
    setSelectedKpiIds(prev =>
      prev.includes(kpi.id)
        ? prev.filter(id => id !== kpi.id)
        : [...prev, kpi.id]
    );
  };

  // Confirm selected KPIs and add them to the dashboard
  const handleKpiDone = () => {
    if (selectedKpiIds.length) {
      // Flatten all available KPIs into a single array for lookup
      const allAvailable = Object.values(availableKpis).flat();
      const newlySelected = allAvailable.filter(k => selectedKpiIds.includes(k.id));

      setKpis(prev => {
        const existingIds = prev.map(k => k.id);
        const toAdd = newlySelected.filter(k => !existingIds.includes(k.id)).map(k => ({
          id: k.id,
          title: k.name,
          value: k.value,
          change: k.change,
          trend: k.trend,
          color: k.trend === 'up' ? '#10b981' : '#ef4444',
          icon: k.trend === 'up' ? TrendingUp : TrendingDown,
          removable: true
        }));
        return [...prev, ...toAdd];
      });
    }

    // Reset selection & close modal
    setSelectedKpiIds([]);
    closeKpiModal();
  };
  
  // Handle KPI removal
  const handleKpiRemove = (kpiId) => {
    setKpis(prevKpis => prevKpis.filter(kpi => kpi.id !== kpiId));
  };
  
  // Handle clear chat functionality
  const handleClearChat = () => {
    setSearchQuery('');
    setAiResponse('');
    setConversation([]);
    setIsLoading(false);
    // Optionally clear chat history if needed
    // setChatHistory([]);
  };

  // Response action handlers
  const handleCopyResponse = async (content, messageId) => {
    try {
      // Trigger animation
      triggerButtonAnimation(`copy-${messageId}`);
      
      // Toggle copied state
      setCopiedMessages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(messageId)) {
          newSet.delete(messageId);
          return newSet;
        } else {
          newSet.add(messageId);
          // Copy to clipboard only when selecting (not when deselecting)
          navigator.clipboard.writeText(content);
          setToastMessage('Copied to clipboard');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 1500);
          return newSet;
        }
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleThumbsUp = (messageId) => {
    // Trigger animation
    triggerButtonAnimation(`thumbsup-${messageId}`);
    
    // Remove from disliked if it was disliked
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
    
    // Toggle liked state
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleThumbsDown = (messageId) => {
    // Trigger animation
    triggerButtonAnimation(`thumbsdown-${messageId}`);
    
    // Remove from liked if it was liked
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
    
    // Add to disliked
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });
    
    setFeedbackMessageId(messageId);
    setSelectedFeedback([]);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const handleSaveResponse = (messageId, content) => {
    // Trigger animation
    triggerButtonAnimation(`bookmark-${messageId}`);
    
    // Toggle bookmarked state
    setBookmarkedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        // Remove bookmark
        newSet.delete(messageId);
        setBookmarks(bookmarksPrev => bookmarksPrev.filter(b => b.id !== messageId));
        return newSet;
      } else {
        // Add bookmark
        newSet.add(messageId);
        const message = conversation.find(msg => msg.id === messageId);
        if (message) {
          const bookmark = {
            id: messageId,
            content: content,
            query: message.query || '',
            timestamp: message.timestamp,
            savedAt: new Date().toISOString()
          };
          setBookmarks(bookmarksPrev => [bookmark, ...bookmarksPrev]);
          // Show toast notification
          setToastMessage('Prompt saved to your profile');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
        return newSet;
      }
    });
  };

  const toggleFeedbackOption = (feedbackType) => {
    setSelectedFeedback(prev => 
      prev.includes(feedbackType)
        ? prev.filter(type => type !== feedbackType)
        : [...prev, feedbackType]
    );
  };

  const handleFeedbackSubmit = () => {
    const feedback = {
      messageId: feedbackMessageId,
      selectedOptions: selectedFeedback,
      text: feedbackText
    };
    
    // Feedback submitted - could be sent to analytics service
    
    // Close modal and reset state
    setShowFeedbackModal(false);
    setFeedbackMessageId(null);
    setSelectedFeedback([]);
    setFeedbackText('');
    
    // Show thank you toast
    setToastMessage('Thanks for your feedback');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide after 3 seconds
  };
  
  // Handle chat selection from sidebar
  const handleChatSelect = (chat) => {
    setSearchQuery('');
    setAiResponse({
      text: chat.response,
      metrics: chat.metrics
    });
    
    // Load conversation from history
    const historyConversation = [
      {
        id: 'history-user',
        type: 'user',
        content: chat.query,
        timestamp: chat.timestamp
      },
      {
        id: 'history-ai',
        type: 'ai',
        content: chat.response,
        metrics: chat.metrics,
        timestamp: chat.timestamp
      }
    ];
    
    setConversation(historyConversation);
    
    // Scroll to response area
    setTimeout(() => {
      responseRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  // Handle alert click to populate chatbot with prompt
  const handleAlertClick = (alert) => {
    setSearchQuery(alert.prompt);
    setAiResponse(''); // Clear any existing response
    setConversation([]); // Start fresh conversation
    
    // Scroll to MIA chatbot section
    document.querySelector('.chat-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  // Navigation handler
  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
    setActiveItem(viewId);
    
    // Scroll to top when navigating to home or discover
    if (viewId === 'home' || viewId === 'discover') {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Notification handlers
  const handleNotificationToggle = () => {
    setShowNotifications(prev => !prev);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleClearNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  // Handle tool visits from Discover
  const handleToolVisit = (tool) => {
    const recentTool = {
      id: `tool-${tool.id}`,
      name: tool.name,
      category: tool.category,
      icon: tool.icon,
      visitedAt: new Date().toISOString()
    };

    setRecentTools(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(item => item.id !== recentTool.id);
      // Add to beginning and limit to 5 recent items
      return [recentTool, ...filtered].slice(0, 5);
    });
    
    // Set the clicked tool as active in sidebar
    setActiveItem(`tool-${tool.id}`);
  };

  return (
    <div className="dashboard">
      <Sidebar 
        onLogout={onLogout} 
        chatHistory={chatHistory}
        onChatSelect={handleChatSelect}
        onToggleCollapse={setIsSidebarCollapsed}
        isCollapsed={isSidebarCollapsed}
        onNavigate={handleNavigation}
        currentView={currentView}
        recentTools={recentTools}
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
      />
      
      {/* Expand button when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <button 
          className="expand-sidebar-btn"
          onClick={() => setIsSidebarCollapsed(false)}
          title="Expand sidebar"
        >
          <Menu size={20} />
        </button>
      )}
      
      <main className={`dashboard-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {currentView === 'home' && (
          <>
            <header className="dashboard-header">
              <div className="header-content">
                <div className="welcome-section">
                  <h1 className="welcome-title">
                    Hey Sarah! 👋
                  </h1>
                  <p className="welcome-subtitle">
                    Welcome back, Brand Manager at Diageo
                  </p>
                </div>
                
                <div className="header-actions">
                  <div className="notification-container">
                    <button 
                      className="notification-btn"
                      onClick={handleNotificationToggle}
                      title="Notifications"
                    >
                      <Bell size={20} />
                      {getUnreadCount() > 0 && (
                        <span className="notification-badge">{getUnreadCount()}</span>
                      )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="notifications-dropdown">
                        <div className="notifications-header">
                          <h3>Notifications</h3>
                          <div className="notifications-actions">
                            {getUnreadCount() > 0 && (
                              <button 
                                className="mark-all-read-btn"
                                onClick={handleMarkAllRead}
                                title="Mark all as read"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="notifications-list">
                          {notifications.length === 0 ? (
                            <div className="no-notifications">
                              <Bell size={24} color="#94a3b8" />
                              <p>No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map(notification => (
                              <div 
                                key={notification.id}
                                className={`notification-item ${!notification.isRead ? 'unread' : ''} priority-${notification.priority}`}
                                onClick={() => handleNotificationRead(notification.id)}
                              >
                                <div className="notification-content">
                                  <div className="notification-header">
                                    <h4 className="notification-title">{notification.title}</h4>
                                    <div className="notification-meta">
                                      <span className="notification-time">{formatTimeAgo(notification.timestamp)}</span>
                                      <button 
                                        className="notification-close"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleClearNotification(notification.id);
                                        }}
                                        title="Remove notification"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="notification-message">{notification.message}</p>
                                  <div className="notification-footer">
                                    <span className={`notification-type type-${notification.type}`}>
                                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                    </span>
                                    {!notification.isRead && <div className="unread-indicator"></div>}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        {notifications.length > 0 && (
                          <div className="notifications-footer">
                            <p className="notifications-count">
                              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                              {getUnreadCount() > 0 && ` • ${getUnreadCount()} unread`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="profile-container">
                    <button 
                      className="profile-btn"
                      onClick={() => setShowProfileDropdown(prev => !prev)}
                      title={`${userProfile.name} - ${userProfile.role}`}
                    >
                      <User size={20} />
                    </button>
                    
                    {/* User Profile Dropdown */}
                    <UserProfile
                      isOpen={showProfileDropdown}
                      onClose={() => setShowProfileDropdown(false)}
                      userProfile={userProfile}
                      onUpdateProfile={handleUpdateProfile}
                      savedPrompts={savedPrompts}
                      onRemovePrompt={handleRemovePrompt}
                      modes={modes}
                      onModeChange={handleModeChange}
                    />
                  </div>
                </div>
              </div>
            </header>

        <div className="dashboard-content">
          {/* KPIs Section */}
          <section className="kpis-section">
            <div className="section-header">
              <div className="kpis-title-section">
                <BarChart3 className="section-icon" size={20} />
                <h2 className="section-title">Your Key Performance Indicators</h2>
              </div>
            </div>
            <div className="kpis-scrollable-container">
              <div className="kpis-horizontal-grid">
                {kpis.map((kpi, index) => (
                  <MetricCard 
                    key={kpi.id}
                    {...kpi} 
                    onClick={() => handleKpiClick(kpi.title)}
                    onRemove={() => handleKpiRemove(kpi.id)}
                  />
                ))}
                {/* Add New KPI Button */}
                <div className="add-kpi-card" onClick={openKpiModal}>
                  <div className="add-kpi-content">
                    <Plus size={24} className="add-kpi-icon" />
                    <span className="add-kpi-text">Add new KPI</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Alerts Section */}
          <section className="alerts-section">
            <div 
              className="alerts-dropdown-header"
              onClick={() => setIsAlertsExpanded(!isAlertsExpanded)}
            >
              <div className="alerts-title-section">
                <AlertTriangle className="section-icon" size={20} />
                <h2 className="section-title">Critical Attention</h2>
                <span className="alert-count">{alerts.filter(alert => alert.priority === 'HIGH').length} Critical</span>
              </div>
              <div className="dropdown-arrow">
                {isAlertsExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
            
            <div className={`alerts-container ${isAlertsExpanded ? 'expanded' : 'collapsed'}`}>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} {...alert} onClick={() => handleAlertClick(alert)} />
              ))}
            </div>
          </section>

          {/* MIA Chat Section */}
          <section className="chat-section">
            <div className="chat-title-container">
              <div className="chat-header-content">
                <div className="chat-logo">
                  <img 
                    src="/MIA LOOG 2.png" 
                    alt="MIA Logo" 
                    
                  />
                </div>
                <div className="chat-title-content">
                  <h2 className="chat-title">Ask MIA Anything</h2>
                  <p className="chat-subtitle">Get insights about your brand and campaigns</p>
                </div>
              </div>
            </div>

            {/* Conversation Interface */}
            {(conversation.length > 0 || isLoading) && (
              <div className="conversation-container" ref={responseRef}>
                {conversation.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    {message.type === 'user' ? (
                      <div className="user-message">
                        <div className="message-content">
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="ai-message">
                        <div className="message-content">
                          <div className="response-header">
                            <h4>MIA Analysis</h4>
                            <span className="response-time">Just now</span>
                          </div>
                          <div className="response-text">
                            {message.content.split('\n').map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                          {message.metrics && (
                            <div className="response-metrics">
                              <h5>Key KPIs</h5>
                              <div className="metrics-tags">
                                {message.metrics.map((metric, index) => (
                                  <span key={index} className="metric-tag">
                                    {metric}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Response Action Buttons */}
                          <div className="response-actions">
                            <button 
                              className={`action-btn ${copiedMessages.has(message.id) ? 'selected' : ''} ${animatingButtons.has(`copy-${message.id}`) ? 'animating' : ''}`}
                              onClick={() => handleCopyResponse(message.content, message.id)}
                              title="Copy"
                            >
                              <Copy size={16} />
                            </button>
                            
                            {/* Show thumbs up only if not disliked */}
                            {!dislikedMessages.has(message.id) && (
                              <button 
                                className={`action-btn ${likedMessages.has(message.id) ? 'liked' : ''} ${animatingButtons.has(`thumbsup-${message.id}`) ? 'animating' : ''}`}
                                onClick={() => handleThumbsUp(message.id)}
                                title="Good response"
                              >
                                <ThumbsUp size={16} />
                              </button>
                            )}
                            
                            {/* Show thumbs down only if not liked */}
                            {!likedMessages.has(message.id) && (
                              <button 
                                className={`action-btn ${dislikedMessages.has(message.id) ? 'disliked' : ''} ${animatingButtons.has(`thumbsdown-${message.id}`) ? 'animating' : ''}`}
                                onClick={() => handleThumbsDown(message.id)}
                                title="Bad response"
                              >
                                <ThumbsDown size={16} />
                              </button>
                            )}
                            
                            <button 
                              className={`action-btn ${bookmarkedMessages.has(message.id) ? 'bookmarked' : ''} ${animatingButtons.has(`bookmark-${message.id}`) ? 'animating' : ''}`}
                              onClick={() => handleSaveResponse(message.id, message.content)}
                              title="Save prompt for later"
                            >
                              <Bookmark size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator for new messages */}
                {isLoading && (
                  <div className="message ai">
                    <div className="ai-message">
                      <div className="message-content">
                        <div className="response-loading">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <p>MIA is analyzing your data...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="suggested-prompts">
              <h3 className="prompts-label">Suggested prompts</h3>
              <div className="prompts-grid">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="prompt-btn"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mia-search-container">
              <div className="search-input-wrapper">
                <button 
                  className="attachment-btn"
                  onClick={handleAttachment}
                  title="Attach document or image"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Ask about your brand performance, campaigns, or market insights..."
                  className="mia-search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                <button 
                  className="search-send-btn"
                  onClick={handleSearchSubmit}
                  disabled={isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
              
              {/* Clear Chat Option */}
              {(conversation.length > 0 || aiResponse) && (
                <div className="clear-chat-container">
                  <button 
                    className="clear-chat-btn"
                    onClick={handleClearChat}
                    title="Clear current conversation"
                  >
                    <RotateCcw size={14} />
                    <span>Clear chat</span>
                  </button>
                  <button 
                    className="new-chat-btn-small"
                    onClick={handleClearChat}
                    title="Start a new conversation"
                  >
                    <MessageSquarePlus size={14} />
                    <span>Start a new chat</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
          </>
        )}

        {currentView === 'discover' && <Discover onToolVisit={handleToolVisit} onNavigate={handleNavigation} />}
        
        {currentView !== 'home' && currentView !== 'discover' && (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <p>** User to be redirected to the Tool Page**</p>
              <button 
                className="back-home-btn"
                onClick={() => handleNavigation('home')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* KPI Selection Modal */}
      {isKpiModalOpen && (
        <div className="modal-overlay" onClick={closeKpiModal}>
          <div className="kpi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2 className="modal-title">Add New KPI</h2>
                <p className="modal-subtitle">Choose from our curated list of marketing KPIs to track what matters most</p>
              </div>
              <button className="modal-close-btn" onClick={closeKpiModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-search">
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search KPIs..."
                  value={kpiSearchTerm}
                  onChange={(e) => setKpiSearchTerm(e.target.value)}
                  className="modal-search-input"
                />
              </div>
            </div>

            {/* Enhanced Category Tabs */}
            <div className="kpi-categories">
              <button 
                className={`category-tab ${selectedKpiCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedKpiCategory('all')}
              >
                All KPIs <span className="category-count">{getCategoryCount('all')}</span>
              </button>
              <button 
                className={`category-tab ${selectedKpiCategory === 'brand' ? 'active' : ''}`}
                onClick={() => setSelectedKpiCategory('brand')}
              >
                Brand & Awareness <span className="category-count">{getCategoryCount('brand')}</span>
              </button>
              <button 
                className={`category-tab ${selectedKpiCategory === 'performance' ? 'active' : ''}`}
                onClick={() => setSelectedKpiCategory('performance')}
              >
                Performance & ROI <span className="category-count">{getCategoryCount('performance')}</span>
              </button>
              <button 
                className={`category-tab ${selectedKpiCategory === 'social' ? 'active' : ''}`}
                onClick={() => setSelectedKpiCategory('social')}
              >
                Social & Engagement <span className="category-count">{getCategoryCount('social')}</span>
              </button>
              <button 
                className={`category-tab ${selectedKpiCategory === 'digital' ? 'active' : ''}`}
                onClick={() => setSelectedKpiCategory('digital')}
              >
                Digital & Web <span className="category-count">{getCategoryCount('digital')}</span>
              </button>
            </div>
            
            <div className="kpi-content">
              {!kpiSearchTerm && selectedKpiCategory === 'all' && (
                <>
                  {/* Recommended for You Section */}
                  <div className="recommended-section">
                    <div className="section-header">
                      <div className="section-indicator"></div>
                      <h3>Recommended for You</h3>
                    </div>
                    <div className="kpi-grid">
                      {[...availableKpis.brandAwareness, ...availableKpis.performanceROI, ...availableKpis.socialEngagement, ...availableKpis.digitalWeb]
                        .filter(kpi => kpi.recommended)
                        .map((kpi) => (
                        <div key={kpi.id} className="kpi-card">
                          <div className="kpi-card-header">
                            <div className="kpi-icon">
                              {kpi.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div className="kpi-badges">
                              {kpi.recommended && <span className="kpi-badge recommended">Recommended</span>}
                              {kpi.popular && <span className="kpi-badge popular">Popular</span>}
                            </div>
                          </div>
                          <h4 className="kpi-card-title">{kpi.name}</h4>
                          <p className="kpi-card-description">{kpi.description}</p>
                          <div className="kpi-metrics">
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change ${kpi.trend}`}>{kpi.change}</div>
                            <div className="kpi-chart">
                              <div className="mini-chart"></div>
                            </div>
                          </div>
                          <button 
                            className={`add-kpi-btn ${selectedKpiIds.includes(kpi.id) ? 'added' : ''}` }
                            onClick={() => handleKpiSelect(kpi)}
                          >
                            {selectedKpiIds.includes(kpi.id) ? 'Added KPI' : (<><Plus size={16} /> Add KPI</>)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Choices Section */}
                  <div className="popular-section">
                    <div className="section-header">
                      <div className="section-indicator popular"></div>
                      <h3>Popular Choices</h3>
                    </div>
                    <div className="kpi-grid">
                      {[...availableKpis.brandAwareness, ...availableKpis.performanceROI, ...availableKpis.socialEngagement, ...availableKpis.digitalWeb]
                        .filter(kpi => kpi.popular)
                        .map((kpi) => (
                        <div key={`popular-${kpi.id}`} className="kpi-card">
                          <div className="kpi-card-header">
                            <div className="kpi-icon">
                              {kpi.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div className="kpi-badges">
                              {kpi.recommended && <span className="kpi-badge recommended">Recommended</span>}
                              {kpi.popular && <span className="kpi-badge popular">Popular</span>}
                            </div>
                          </div>
                          <h4 className="kpi-card-title">{kpi.name}</h4>
                          <p className="kpi-card-description">{kpi.description}</p>
                          <div className="kpi-metrics">
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change ${kpi.trend}`}>{kpi.change}</div>
                            <div className="kpi-chart">
                              <div className="mini-chart"></div>
                            </div>
                          </div>
                          <button 
                            className={`add-kpi-btn ${selectedKpiIds.includes(kpi.id) ? 'added' : ''}` }
                            onClick={() => handleKpiSelect(kpi)}
                          >
                            {selectedKpiIds.includes(kpi.id) ? 'Added KPI' : (<><Plus size={16} /> Add KPI</>)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Available KPIs Section */}
                  <div className="all-kpis-section">
                    <div className="section-header">
                      <div className="section-indicator all"></div>
                      <h3>All Available KPIs</h3>
                    </div>
                    <div className="kpi-grid">
                      {[...availableKpis.brandAwareness, ...availableKpis.performanceROI, ...availableKpis.socialEngagement, ...availableKpis.digitalWeb]
                        .filter(kpi => !kpi.popular && !kpi.recommended)
                        .map((kpi) => (
                        <div key={`all-${kpi.id}`} className="kpi-card">
                          <div className="kpi-card-header">
                            <div className="kpi-icon">
                              {kpi.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div className="kpi-badges">
                              {kpi.recommended && <span className="kpi-badge recommended">Recommended</span>}
                              {kpi.popular && <span className="kpi-badge popular">Popular</span>}
                            </div>
                          </div>
                          <h4 className="kpi-card-title">{kpi.name}</h4>
                          <p className="kpi-card-description">{kpi.description}</p>
                          <div className="kpi-metrics">
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change ${kpi.trend}`}>{kpi.change}</div>
                            <div className="kpi-chart">
                              <div className="mini-chart"></div>
                            </div>
                          </div>
                          <button 
                            className={`add-kpi-btn ${selectedKpiIds.includes(kpi.id) ? 'added' : ''}` }
                            onClick={() => handleKpiSelect(kpi)}
                          >
                            {selectedKpiIds.includes(kpi.id) ? 'Added KPI' : (<><Plus size={16} /> Add KPI</>)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="kpi-list-section">
                {getFilteredKpis().length === 0 ? (
                  <div className="no-results">
                    <p>No KPIs found matching your search.</p>
                  </div>
                ) : (
                  <div className="kpi-grid">
                    {getFilteredKpis().map((kpi) => (
                      <div key={kpi.id} className="kpi-card">
                        <div className="kpi-card-header">
                          <div className="kpi-icon">
                            {kpi.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div className="kpi-badges">
                            {kpi.recommended && <span className="kpi-badge recommended">Recommended</span>}
                            {kpi.popular && <span className="kpi-badge popular">Popular</span>}
                          </div>
                        </div>
                        <h4 className="kpi-card-title">{kpi.name}</h4>
                        <p className="kpi-card-description">{kpi.description}</p>
                        <div className="kpi-metrics">
                          <div className="kpi-value">{kpi.value}</div>
                          <div className={`kpi-change ${kpi.trend}`}>{kpi.change}</div>
                          <div className="kpi-chart">
                            <div className="mini-chart"></div>
                          </div>
                        </div>
                        <button 
                          className={`add-kpi-btn ${selectedKpiIds.includes(kpi.id) ? 'added' : ''}` }
                          onClick={() => handleKpiSelect(kpi)}
                        >
                          {selectedKpiIds.includes(kpi.id) ? 'Added KPI' : (<><Plus size={16} /> Add KPI</>)}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="done-btn" onClick={handleKpiDone}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-header">
              <h3>Tell us more</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowFeedbackModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="feedback-content">
              <div className="feedback-options">
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('memory') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('memory')}
                >
                  Shouldn't have used Memory
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('personality') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('personality')}
                >
                  Don't like the personality
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('style') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('style')}
                >
                  Don't like the style
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('factual') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('factual')}
                >
                  Not factually correct
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('instructions') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('instructions')}
                >
                  Didn't fully follow instructions
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('refused') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('refused')}
                >
                  Refused when it shouldn't have
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('lazy') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('lazy')}
                >
                  Being lazy
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('unsafe') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('unsafe')}
                >
                  Unsafe or problematic
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('biased') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('biased')}
                >
                  Biased
                </button>
                <button 
                  className={`feedback-option-btn ${selectedFeedback.includes('other') ? 'selected' : ''}`}
                  onClick={() => toggleFeedbackOption('other')}
                >
                  Other
                </button>
              </div>
              
              <textarea 
                className="feedback-textarea"
                placeholder="(Optional) Feel free to add specific details"
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              
              <div className="feedback-disclaimer">
                <p>Submitting feedback will include this full conversation to help improve MIA, even if 'Improve the model for everyone' is turned off. <a href="#">Learn more</a></p>
              </div>
              
              <div className="feedback-actions">
                <button className="feedback-submit-btn" onClick={handleFeedbackSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
