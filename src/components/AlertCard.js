import React from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import './AlertCard.css';

const AlertCard = ({ id, type, title, timeAgo, priority, onClick }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'HIGH':
        return {
          className: 'high',
          color: '#ef4444',
          backgroundColor: '#fef2f2',
          label: 'HIGH'
        };
      case 'MEDIUM':
        return {
          className: 'medium',
          color: '#f59e0b',
          backgroundColor: '#fef3c7',
          label: 'MEDIUM'
        };
      case 'LOW':
        return {
          className: 'low',
          color: '#10b981',
          backgroundColor: '#d1fae5',
          label: 'LOW'
        };
      default:
        return {
          className: 'medium',
          color: '#f59e0b',
          backgroundColor: '#fef3c7',
          label: 'MEDIUM'
        };
    }
  };

  const priorityConfig = getPriorityConfig(priority);

  const handleDismiss = (e) => {
    e.stopPropagation();
    // Handle dismiss logic
    console.log(`Dismissing alert ${id}`);
  };

  const handleClick = () => {
    // Handle alert click
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`alert-card ${type} ${priorityConfig.className}`}
      onClick={handleClick}
    >
      <div className="alert-content">
        <div className="alert-header">
          <div className="alert-icon-container">
            <AlertTriangle 
              size={16} 
              style={{ color: priorityConfig.color }}
            />
          </div>
          
          <div className="alert-priority">
            <span 
              className="priority-badge"
              style={{ 
                backgroundColor: priorityConfig.backgroundColor,
                color: priorityConfig.color 
              }}
            >
              {priorityConfig.label}
            </span>
          </div>
          
          <button 
            className="alert-dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <X size={14} />
          </button>
        </div>
        
        <div className="alert-body">
          <p className="alert-title">{title}</p>
          
          <div className="alert-meta">
            <div className="alert-time">
              <Clock size={12} />
              <span>Due: {timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="alert-indicator"
        style={{ backgroundColor: priorityConfig.color }}
      ></div>
    </div>
  );
};

export default AlertCard;
