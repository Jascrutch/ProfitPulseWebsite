import React from 'react';
import { WebSocketMessage, PriceUpdate } from '@/types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(url: string = 'ws://localhost:8080/ws') {
    this.url = url;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve();
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          
          // Attempt to reconnect unless it was a deliberate close
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Deliberate disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
  }

  /**
   * Send a message to the WebSocket server
   */
  send(type: string, payload: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    
    console.warn('WebSocket is not connected');
    return false;
  }

  /**
   * Subscribe to messages of a specific type
   */
  subscribe(messageType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    
    this.listeners.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(messageType);
      if (typeListeners) {
        typeListeners.delete(callback);
        if (typeListeners.size === 0) {
          this.listeners.delete(messageType);
        }
      }
    };
  }

  /**
   * Subscribe to price updates for specific symbols
   */
  subscribeToPriceUpdates(symbols: string[], callback: (update: PriceUpdate) => void): () => void {
    // Send subscription request to server
    this.send('subscribe_prices', { symbols });

    // Subscribe to price update messages
    return this.subscribe('price_update', callback);
  }

  /**
   * Subscribe to trade execution updates
   */
  subscribeToTradeUpdates(callback: (trade: any) => void): () => void {
    return this.subscribe('trade_update', callback);
  }

  /**
   * Subscribe to portfolio updates
   */
  subscribeToPortfolioUpdates(callback: (portfolio: any) => void): () => void {
    return this.subscribe('portfolio_update', callback);
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
      default:
        return 'closed';
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    const typeListeners = this.listeners.get(message.type);
    if (typeListeners) {
      typeListeners.forEach(callback => {
        try {
          callback(message.payload);
        } catch (error) {
          console.error('Error in WebSocket message handler:', error);
        }
      });
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

// Mock data generators for development
export const mockPriceUpdates = (symbols: string[]): void => {
  // Generate mock price updates when WebSocket is not available
  const generateUpdate = (symbol: string): PriceUpdate => {
    const basePrice = Math.random() * 1000 + 50; // Price between $50-$1050
    const change = (Math.random() - 0.5) * 20; // Change between -$10 and +$10
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
    };
  };

  // Simulate real-time updates
  setInterval(() => {
    symbols.forEach(symbol => {
      const update = generateUpdate(symbol);
      // Simulate WebSocket message
      const listeners = (webSocketService as any).listeners.get('price_update');
      if (listeners) {
        listeners.forEach((callback: (data: any) => void) => callback(update));
      }
    });
  }, 2000); // Update every 2 seconds
};

// React hook for WebSocket connection
export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = React.useState<string>('closed');

  React.useEffect(() => {
    const updateStatus = () => {
      setConnectionStatus(webSocketService.getConnectionStatus());
    };

    // Check status periodically
    const statusInterval = setInterval(updateStatus, 1000);
    updateStatus();

    return () => clearInterval(statusInterval);
  }, []);

  return {
    connectionStatus,
    connect: () => webSocketService.connect(),
    disconnect: () => webSocketService.disconnect(),
    send: webSocketService.send.bind(webSocketService),
    subscribe: webSocketService.subscribe.bind(webSocketService),
    subscribeToPriceUpdates: webSocketService.subscribeToPriceUpdates.bind(webSocketService),
    subscribeToTradeUpdates: webSocketService.subscribeToTradeUpdates.bind(webSocketService),
    subscribeToPortfolioUpdates: webSocketService.subscribeToPortfolioUpdates.bind(webSocketService),
  };
};