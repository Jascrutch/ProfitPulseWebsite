import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationHelpers } from '@/contexts/NotificationContext';
import { Portfolio, PriceUpdate } from '@/types';
import { useWebSocket } from '@/services/websocket';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { notifySuccess } = useNotificationHelpers();
  const { connectionStatus, subscribeToPriceUpdates } = useWebSocket();
  const [portfolio] = useState<Portfolio>({
    id: '1',
    userId: user?.id || '1',
    totalValue: 125430.50,
    dailyChange: 2340.25,
    dailyChangePercent: 1.89,
    positions: [
      { symbol: 'AAPL', quantity: 50, averagePrice: 175.20, currentPrice: 178.45, value: 8922.50, change: 162.50, changePercent: 1.85 },
      { symbol: 'GOOGL', quantity: 25, averagePrice: 2680.10, currentPrice: 2720.30, value: 68007.50, change: 1005.00, changePercent: 1.50 },
      { symbol: 'MSFT', quantity: 75, averagePrice: 320.45, currentPrice: 325.80, value: 24435.00, change: 401.25, changePercent: 1.67 },
      { symbol: 'TSLA', quantity: 30, averagePrice: 245.60, currentPrice: 251.20, value: 7536.00, change: 168.00, changePercent: 2.28 },
    ],
    cashBalance: 16529.50,
  });

  const [priceUpdates, setPriceUpdates] = useState<Record<string, PriceUpdate>>({});

  useEffect(() => {
    // Subscribe to price updates for portfolio positions
    const symbols = portfolio.positions.map(p => p.symbol);
    const unsubscribe = subscribeToPriceUpdates(symbols, (update: PriceUpdate) => {
      setPriceUpdates(prev => ({
        ...prev,
        [update.symbol]: update,
      }));
    });

    return unsubscribe;
  }, [portfolio.positions, subscribeToPriceUpdates]);

  useEffect(() => {
    // Welcome notification for new sessions
    const hasShownWelcome = sessionStorage.getItem('welcome_shown');
    if (!hasShownWelcome && user) {
      setTimeout(() => {
        notifySuccess(
          `Welcome back, ${user.firstName}!`,
          'Your portfolio is performing well today.',
          '/portfolio',
          'View Details'
        );
        sessionStorage.setItem('welcome_shown', 'true');
      }, 2000);
    }
  }, [user, notifySuccess]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${connectionStatus}`}></span>
          Market data: {connectionStatus}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Portfolio Value</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-value">{formatCurrency(portfolio.totalValue)}</div>
          <div className={`stat-change ${portfolio.dailyChange >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(portfolio.dailyChange)} ({formatPercent(portfolio.dailyChangePercent)})
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Cash Balance</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div className="stat-value">{formatCurrency(portfolio.cashBalance)}</div>
          <div className="stat-change neutral">Available for trading</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Positions</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div className="stat-value">{portfolio.positions.length}</div>
          <div className="stat-change neutral">Holdings</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Today's Best Performer</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </div>
          <div className="stat-value">
            {portfolio.positions.reduce((best, pos) => 
              pos.changePercent > best.changePercent ? pos : best
            ).symbol}
          </div>
          <div className="stat-change positive">
            {formatPercent(portfolio.positions.reduce((best, pos) => 
              pos.changePercent > best.changePercent ? pos : best
            ).changePercent)}
          </div>
        </div>
      </div>

      {/* Portfolio Positions */}
      <div className="positions-section">
        <h2>Portfolio Positions</h2>
        <div className="positions-table">
          <div className="table-header">
            <div>Symbol</div>
            <div>Quantity</div>
            <div>Avg Price</div>
            <div>Current Price</div>
            <div>Value</div>
            <div>Change</div>
          </div>
          {portfolio.positions.map((position) => {
            const currentUpdate = priceUpdates[position.symbol];
            const currentPrice = currentUpdate?.price || position.currentPrice;
            const change = currentUpdate?.change || position.change;
            const changePercent = currentUpdate?.changePercent || position.changePercent;
            const value = currentPrice * position.quantity;

            return (
              <div key={position.symbol} className="table-row">
                <div className="symbol-cell">
                  <strong>{position.symbol}</strong>
                  {currentUpdate && (
                    <span className="live-indicator" title="Live data">
                      <span className="pulse"></span>
                    </span>
                  )}
                </div>
                <div>{position.quantity}</div>
                <div>{formatCurrency(position.averagePrice)}</div>
                <div>{formatCurrency(currentPrice)}</div>
                <div>{formatCurrency(value)}</div>
                <div className={change >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(change)} ({formatPercent(changePercent)})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => window.location.href = '/trading'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            <span>Start Trading</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/watchlist'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>View Watchlist</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/order-history'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            <span>Order History</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/analytics'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span>Analytics</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 14px;
          color: #666;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #dc3545;
        }

        .status-indicator.open {
          background: #28a745;
          animation: pulse 2s infinite;
        }

        .status-indicator.connecting {
          background: #ffc107;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #666;
        }

        .stat-header svg {
          color: #007bff;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 14px;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #28a745;
        }

        .stat-change.negative {
          color: #dc3545;
        }

        .stat-change.neutral {
          color: #666;
        }

        .positions-section {
          margin-bottom: 3rem;
        }

        .positions-section h2 {
          margin-bottom: 1rem;
          color: #333;
        }

        .positions-table {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 100px 120px 120px 120px 140px;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid #e0e0e0;
          font-size: 14px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 100px 120px 120px 120px 140px;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .symbol-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .live-indicator {
          position: relative;
        }

        .pulse {
          width: 6px;
          height: 6px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .positive {
          color: #28a745;
        }

        .negative {
          color: #dc3545;
        }

        .quick-actions h2 {
          margin-bottom: 1rem;
          color: #333;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: #333;
        }

        .action-card:hover {
          border-color: #007bff;
          background: #f8f9ff;
          transform: translateY(-2px);
        }

        .action-card svg {
          color: #007bff;
        }

        .action-card span {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr 80px 100px;
            font-size: 12px;
          }

          .table-header div:nth-child(n+4),
          .table-row div:nth-child(n+4) {
            display: none;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;