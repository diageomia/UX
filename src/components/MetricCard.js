import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({ title, value, change, trend, color, icon: Icon, onClick }) => {
  const isPositive = trend === 'up';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className="metric-card" onClick={handleClick}>
      <div className="metric-header">
        <div className="metric-info">
          <h3 className="metric-title">{title}</h3>
          <div className="metric-value-container">
            <span className="metric-value">{value}</span>
            <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span className="change-value">{change}</span>
            </div>
          </div>
        </div>
        
        <div className="metric-icon-container" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      
      <div className="metric-chart">
        <div className="chart-container">
          {/* Simple trend line visualization */}
          <svg width="100%" height="40" className="trend-chart">
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '-').toLowerCase()}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>
            
            {/* Generate sample trend data */}
            {(() => {
              const points = [];
              const width = 100;
              const height = 40;
              const dataPoints = 8;
              
              for (let i = 0; i < dataPoints; i++) {
                const x = (i / (dataPoints - 1)) * width;
                const baseY = height * 0.7;
                const variation = Math.sin(i * 0.8) * 10 + (isPositive ? -5 : 5);
                const y = Math.max(5, Math.min(height - 5, baseY + variation));
                points.push(`${x},${y}`);
              }
              
              const pathData = `M ${points.join(' L ')}`;
              const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
              
              return (
                <g>
                  <path
                    d={areaData}
                    fill={`url(#gradient-${title.replace(/\s+/g, '-').toLowerCase()})`}
                  />
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

    </div>
  );
};

export default MetricCard;
