import React, { useState } from 'react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Sign Up" button on the login page. Fill in your personal information, choose a secure password, and verify your email address. For demo purposes, you can also use one of our demo accounts with different permission levels.',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'What are the different user roles?',
    answer: 'ProfitPulse has three user roles: Guest (view-only access to public data), Trader (full trading capabilities and portfolio management), and Admin (access to administrative features and API documentation). Demo accounts are available for each role.',
  },
  {
    id: '3',
    category: 'Trading',
    question: 'How do I place a trade?',
    answer: 'Navigate to the Trading page from the sidebar menu. Search for the stock symbol you want to trade, select buy or sell, enter the quantity, choose your order type (market, limit, or stop), and confirm your order. All trades are currently simulated for demo purposes.',
  },
  {
    id: '4',
    category: 'Trading',
    question: 'What order types are supported?',
    answer: 'We support three main order types: Market orders (execute immediately at current market price), Limit orders (execute only at a specified price or better), and Stop orders (execute when the stock reaches a specified price). More advanced order types will be added in future updates.',
  },
  {
    id: '5',
    category: 'Portfolio',
    question: 'How is my portfolio value calculated?',
    answer: 'Your portfolio value is the sum of all your stock holdings at current market prices plus your available cash balance. Daily changes are calculated based on the previous day\'s closing values. All data updates in real-time during market hours.',
  },
  {
    id: '6',
    category: 'Portfolio',
    question: 'Can I export my portfolio data?',
    answer: 'Yes! You can export your watchlist data as a CSV file from the Watchlist page. Portfolio and order history export features are coming soon. The exported data includes all relevant information like symbols, prices, changes, and volumes.',
  },
  {
    id: '7',
    category: 'Features',
    question: 'How do I add stocks to my watchlist?',
    answer: 'Go to the Watchlist page and click "Add Symbol". You can either type in a stock symbol or select from our available demo symbols. Your watchlist is automatically saved and will show real-time price updates.',
  },
  {
    id: '8',
    category: 'Features',
    question: 'What are notifications and how do they work?',
    answer: 'Notifications keep you informed about important events like price alerts, trade executions, and market updates. You can view all notifications in the Notification Center and customize which types of alerts you receive in your profile settings.',
  },
  {
    id: '9',
    category: 'Technical',
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All authentication tokens are securely stored, and we use industry-standard security practices. For production use, we recommend enabling two-factor authentication and using strong, unique passwords.',
  },
  {
    id: '10',
    category: 'Technical',
    question: 'How do I enable high contrast mode?',
    answer: 'Click the accessibility button (contrast icon) in the top navigation bar to toggle high contrast mode. This setting is automatically saved and will persist across your sessions. This feature helps users with visual impairments navigate the platform more easily.',
  },
  {
    id: '11',
    category: 'Account',
    question: 'How do I update my profile information?',
    answer: 'Go to the Profile page from the user menu in the top-right corner. You can update your personal information, change your password, and modify notification preferences. Changes are saved automatically.',
  },
  {
    id: '12',
    category: 'Account',
    question: 'Can I change my user role?',
    answer: 'User roles are typically assigned by administrators. For demo purposes, you can log out and log back in with a different demo account to experience different permission levels. Contact support for role changes in production environments.',
  },
  {
    id: '13',
    category: 'Troubleshooting',
    question: 'Why aren\'t my price updates working?',
    answer: 'Price updates are powered by WebSocket connections. If updates aren\'t working, check your internet connection and try refreshing the page. The connection status is shown in the top-right corner of the dashboard. Demo data updates every few seconds automatically.',
  },
  {
    id: '14',
    category: 'Troubleshooting',
    question: 'What should I do if I encounter an error?',
    answer: 'If you encounter an error, try refreshing the page first. If the problem persists, check the browser console for error messages and contact our support team through the Contact page. Include details about what you were doing when the error occurred.',
  },
];

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(item => item.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <div className="header-content">
          <h1>Help & FAQ</h1>
          <p>Find answers to frequently asked questions about ProfitPulse</p>
        </div>
      </div>

      <div className="help-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="expand-controls">
            <button className="control-button" onClick={expandAll}>
              Expand All
            </button>
            <button className="control-button" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>
      </div>

      <div className="faq-section">
        {filteredFAQs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>No results found</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div className="faq-list">
            {categories.map(category => {
              const categoryItems = filteredFAQs.filter(item => item.category === category);
              
              if (categoryItems.length === 0 || (selectedCategory !== 'all' && selectedCategory !== category)) {
                return null;
              }

              return (
                <div key={category} className="category-section">
                  <h2 className="category-title">{category}</h2>
                  
                  {categoryItems.map((item) => (
                    <div key={item.id} className="faq-item">
                      <button
                        className={`faq-question ${expandedItems.has(item.id) ? 'expanded' : ''}`}
                        onClick={() => toggleExpanded(item.id)}
                        aria-expanded={expandedItems.has(item.id)}
                        aria-controls={`answer-${item.id}`}
                      >
                        <span className="question-text">{item.question}</span>
                        <svg 
                          className="expand-icon" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="6,9 12,15 18,9"/>
                        </svg>
                      </button>
                      
                      {expandedItems.has(item.id) && (
                        <div 
                          id={`answer-${item.id}`}
                          className="faq-answer"
                          role="region"
                          aria-labelledby={`question-${item.id}`}
                        >
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="help-footer">
        <div className="footer-content">
          <h3>Still need help?</h3>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <div className="footer-actions">
            <a href="/contact" className="contact-button">
              Contact Support
            </a>
            <a href="/api-docs" className="docs-button">
              API Documentation
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .help-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .help-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2.5rem;
        }

        .header-content p {
          margin: 0;
          color: #666;
          font-size: 1.2rem;
        }

        .help-controls {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          border: 1px solid #e0e0e0;
        }

        .search-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          pointer-events: none;
        }

        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .category-filter:focus {
          outline: none;
          border-color: #007bff;
        }

        .expand-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-button {
          padding: 6px 12px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-button:hover {
          background: #e9ecef;
        }

        .faq-section {
          margin-bottom: 3rem;
        }

        .category-section {
          margin-bottom: 2rem;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #007bff;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 1.5rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: #f8f9fa;
        }

        .faq-question.expanded {
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .question-text {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          flex: 1;
          text-align: left;
        }

        .expand-icon {
          color: #666;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .faq-question.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem 1.5rem;
          animation: fadeIn 0.3s ease-out;
        }

        .faq-answer p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-size: 15px;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-icon {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .empty-state p {
          margin: 0;
          font-size: 1rem;
        }

        .help-footer {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .footer-content h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.5rem;
        }

        .footer-content p {
          margin: 0 0 1.5rem 0;
          color: #666;
        }

        .footer-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .contact-button,
        .docs-button {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-button {
          background: #007bff;
          color: white;
        }

        .contact-button:hover {
          background: #0056b3;
          text-decoration: none;
        }

        .docs-button {
          background: #f8f9fa;
          color: #333;
          border: 1px solid #dee2e6;
        }

        .docs-button:hover {
          background: #e9ecef;
          text-decoration: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 2rem;
          }

          .header-content p {
            font-size: 1rem;
          }

          .help-controls {
            padding: 1rem;
          }

          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .expand-controls {
            justify-content: center;
          }

          .faq-question {
            padding: 1rem;
          }

          .faq-answer {
            padding: 0 1rem 1rem 1rem;
          }

          .footer-actions {
            flex-direction: column;
            align-items: center;
          }

          .contact-button,
          .docs-button {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Help;