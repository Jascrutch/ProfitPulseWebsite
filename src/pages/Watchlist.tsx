import React, { useState, useEffect } from 'react';
import { WatchlistItem } from '@/types';
import { formatCurrency, formatPercent, storage } from '@/utils';
import { useDebounce } from '@/hooks';
import { useNotificationHelpers } from '@/contexts/NotificationContext';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingSymbol, setIsAddingSymbol] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [sortField, setSortField] = useState<keyof WatchlistItem>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { notifySuccess, notifyError } = useNotificationHelpers();

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = storage.get<WatchlistItem[]>('user_watchlist', []);
    if (savedWatchlist) {
      setWatchlist(savedWatchlist);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    storage.set('user_watchlist', watchlist);
  }, [watchlist]);

  // Simulate real-time price updates
  useEffect(() => {
    if (watchlist.length === 0) return;

    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(item => {
        const priceChange = (Math.random() - 0.5) * 5; // Random change between -2.5% and +2.5%
        const newPrice = item.price * (1 + priceChange / 100);
        const change = newPrice - item.price;
        const changePercent = (change / item.price) * 100;

        return {
          ...item,
          price: newPrice,
          change,
          changePercent,
          volume: item.volume + Math.floor(Math.random() * 1000),
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [watchlist.length]);

  const mockSymbolData: Record<string, Omit<WatchlistItem, 'symbol' | 'addedAt'>> = {
    'AAPL': { name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: 45234567 },
    'GOOGL': { name: 'Alphabet Inc.', price: 2720.30, change: -15.67, changePercent: -0.57, volume: 1234567 },
    'MSFT': { name: 'Microsoft Corporation', price: 325.80, change: 4.23, changePercent: 1.32, volume: 23456789 },
    'TSLA': { name: 'Tesla, Inc.', price: 251.20, change: 8.90, changePercent: 3.67, volume: 34567890 },
    'AMZN': { name: 'Amazon.com, Inc.', price: 3542.67, change: -23.45, changePercent: -0.66, volume: 2345678 },
    'NVDA': { name: 'NVIDIA Corporation', price: 589.34, change: 12.56, changePercent: 2.18, volume: 12345678 },
    'META': { name: 'Meta Platforms, Inc.', price: 312.45, change: -5.67, changePercent: -1.78, volume: 8765432 },
    'NFLX': { name: 'Netflix, Inc.', price: 456.78, change: 6.78, changePercent: 1.51, volume: 3456789 },
  };

  const addToWatchlist = () => {
    const symbol = newSymbol.trim().toUpperCase();
    
    if (!symbol) {
      notifyError('Invalid Symbol', 'Please enter a valid stock symbol.');
      return;
    }

    if (watchlist.some(item => item.symbol === symbol)) {
      notifyError('Already Added', `${symbol} is already in your watchlist.`);
      return;
    }

    const symbolData = mockSymbolData[symbol];
    if (!symbolData) {
      notifyError('Symbol Not Found', `${symbol} was not found. Please check the symbol and try again.`);
      return;
    }

    const newItem: WatchlistItem = {
      symbol,
      ...symbolData,
      addedAt: new Date().toISOString(),
    };

    setWatchlist(prev => [...prev, newItem]);
    setNewSymbol('');
    setIsAddingSymbol(false);
    
    notifySuccess('Added to Watchlist', `${symbol} has been added to your watchlist.`);
  };

  const removeFromWatchlist = (symbol: string) => {
    if (window.confirm(`Remove ${symbol} from your watchlist?`)) {
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      notifySuccess('Removed from Watchlist', `${symbol} has been removed from your watchlist.`);
    }
  };

  const handleSort = (field: keyof WatchlistItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedWatchlist = watchlist
    .filter(item => 
      item.symbol.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const getSortIcon = (field: keyof WatchlistItem) => {
    if (sortField !== field) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
          <path d="M8 9l4-4 4 4"/>
          <path d="M8 15l4 4 4-4"/>
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 15l4-4 4 4"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 9l4 4 4-4"/>
      </svg>
    );
  };

  const exportWatchlist = () => {
    const csvData = watchlist.map(item => ({
      Symbol: item.symbol,
      Name: item.name,
      Price: item.price.toFixed(2),
      Change: item.change.toFixed(2),
      'Change %': item.changePercent.toFixed(2),
      Volume: item.volume.toLocaleString(),
      'Added Date': new Date(item.addedAt).toLocaleDateString(),
    }));

    // Generate CSV content
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div className="header-main">
          <h1>Watchlist</h1>
          <span className="watchlist-count">{watchlist.length} symbols</span>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          {watchlist.length > 0 && (
            <button className="export-button" onClick={exportWatchlist}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
          )}

          <button
            className="add-button"
            onClick={() => setIsAddingSymbol(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Symbol
          </button>
        </div>
      </div>

      {isAddingSymbol && (
        <div className="add-symbol-form">
          <div className="form-content">
            <h3>Add Symbol to Watchlist</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter symbol (e.g., AAPL)"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                className="symbol-input"
                onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                autoFocus
              />
              <div className="form-actions">
                <button className="cancel-button" onClick={() => {
                  setIsAddingSymbol(false);
                  setNewSymbol('');
                }}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={addToWatchlist}>
                  Add
                </button>
              </div>
            </div>
            <div className="available-symbols">
              <p>Available demo symbols:</p>
              <div className="symbol-chips">
                {Object.keys(mockSymbolData).filter(symbol => 
                  !watchlist.some(item => item.symbol === symbol)
                ).map(symbol => (
                  <button
                    key={symbol}
                    className="symbol-chip"
                    onClick={() => setNewSymbol(symbol)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3>Your watchlist is empty</h3>
          <p>Add stocks to your watchlist to track their performance in real-time.</p>
          <button
            className="empty-add-button"
            onClick={() => setIsAddingSymbol(true)}
          >
            Add Your First Symbol
          </button>
        </div>
      ) : (
        <div className="watchlist-table">
          <div className="table-header">
            <button
              className={`header-cell sortable ${sortField === 'symbol' ? 'active' : ''}`}
              onClick={() => handleSort('symbol')}
            >
              Symbol {getSortIcon('symbol')}
            </button>
            <button
              className={`header-cell sortable ${sortField === 'name' ? 'active' : ''}`}
              onClick={() => handleSort('name')}
            >
              Name {getSortIcon('name')}
            </button>
            <button
              className={`header-cell sortable ${sortField === 'price' ? 'active' : ''}`}
              onClick={() => handleSort('price')}
            >
              Price {getSortIcon('price')}
            </button>
            <button
              className={`header-cell sortable ${sortField === 'change' ? 'active' : ''}`}
              onClick={() => handleSort('change')}
            >
              Change {getSortIcon('change')}
            </button>
            <button
              className={`header-cell sortable ${sortField === 'changePercent' ? 'active' : ''}`}
              onClick={() => handleSort('changePercent')}
            >
              Change % {getSortIcon('changePercent')}
            </button>
            <button
              className={`header-cell sortable ${sortField === 'volume' ? 'active' : ''}`}
              onClick={() => handleSort('volume')}
            >
              Volume {getSortIcon('volume')}
            </button>
            <div className="header-cell">Actions</div>
          </div>

          {filteredAndSortedWatchlist.map((item) => (
            <div key={item.symbol} className="table-row">
              <div className="cell symbol-cell">
                <strong>{item.symbol}</strong>
              </div>
              <div className="cell name-cell">
                {item.name}
              </div>
              <div className="cell price-cell">
                {formatCurrency(item.price)}
              </div>
              <div className={`cell change-cell ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(item.change)}
              </div>
              <div className={`cell percent-cell ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {formatPercent(item.changePercent)}
              </div>
              <div className="cell volume-cell">
                {item.volume.toLocaleString()}
              </div>
              <div className="cell actions-cell">
                <button
                  className="action-button trade"
                  onClick={() => window.location.href = `/trading?symbol=${item.symbol}`}
                  title="Trade this symbol"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                  </svg>
                </button>
                <button
                  className="action-button remove"
                  onClick={() => removeFromWatchlist(item.symbol)}
                  title="Remove from watchlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .watchlist-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .watchlist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .watchlist-header h1 {
          margin: 0;
          color: #333;
        }

        .watchlist-count {
          background: #f8f9fa;
          color: #666;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          padding: 8px 40px 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          min-width: 200px;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          pointer-events: none;
        }

        .export-button,
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .export-button {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .export-button:hover {
          background: #e9ecef;
        }

        .add-button {
          background: #007bff;
          color: white;
        }

        .add-button:hover {
          background: #0056b3;
        }

        .add-symbol-form {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .form-content h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .symbol-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
        }

        .symbol-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
        }

        .cancel-button,
        .confirm-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .cancel-button {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .cancel-button:hover {
          background: #e9ecef;
        }

        .confirm-button {
          background: #28a745;
          color: white;
        }

        .confirm-button:hover {
          background: #218838;
        }

        .available-symbols {
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }

        .available-symbols p {
          margin: 0 0 0.5rem 0;
          font-size: 14px;
          color: #666;
        }

        .symbol-chips {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .symbol-chip {
          padding: 4px 8px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .symbol-chip:hover {
          background: #e9ecef;
          border-color: #007bff;
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
          margin: 0 0 2rem 0;
          font-size: 1rem;
        }

        .empty-add-button {
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .empty-add-button:hover {
          background: #0056b3;
        }

        .watchlist-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 120px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-cell {
          padding: 1rem;
          font-weight: 600;
          color: #333;
          font-size: 14px;
          border: none;
          background: none;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-cell.sortable {
          cursor: pointer;
          transition: background 0.2s;
        }

        .header-cell.sortable:hover {
          background: #e9ecef;
        }

        .header-cell.active {
          color: #007bff;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 120px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .cell {
          padding: 1rem;
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .symbol-cell strong {
          color: #333;
          font-size: 16px;
        }

        .name-cell {
          color: #666;
        }

        .price-cell {
          font-weight: 600;
          color: #333;
        }

        .positive {
          color: #28a745;
        }

        .negative {
          color: #dc3545;
        }

        .volume-cell {
          color: #666;
          font-size: 13px;
        }

        .actions-cell {
          gap: 0.5rem;
        }

        .action-button {
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid #ddd;
          background: white;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: #f8f9fa;
        }

        .action-button.trade {
          color: #007bff;
        }

        .action-button.trade:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .action-button.remove {
          color: #dc3545;
        }

        .action-button.remove:hover {
          border-color: #dc3545;
          background: #fff5f5;
        }

        @media (max-width: 768px) {
          .watchlist-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: stretch;
          }

          .search-input {
            min-width: auto;
            flex: 1;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr 80px 80px;
            font-size: 12px;
          }

          .header-cell:nth-child(n+4),
          .cell:nth-child(n+4) {
            display: none;
          }

          .cell {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Watchlist;