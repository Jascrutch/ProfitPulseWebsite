// User and Authentication types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
}

export type UserRole = 'admin' | 'trader' | 'guest';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

// Trading and Financial types
export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  total: number;
  fees: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  positions: Position[];
  cashBalance: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  change: number;
  changePercent: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  addedAt: string;
}

// Analytics types
export interface AnalyticsData {
  portfolioAllocation: AllocationData[];
  performanceHistory: PerformanceData[];
  roiMetrics: ROIMetrics;
}

export interface AllocationData {
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformanceData {
  date: string;
  value: number;
  profit: number;
  loss: number;
}

export interface ROIMetrics {
  totalROI: number;
  monthlyROI: number;
  yearlyROI: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// UI types
export interface Modal {
  isOpen: boolean;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  value: string;
  label: string;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  highContrast: boolean;
  notifications: NotificationSettings;
  trading: TradingSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  tradeExecutions: boolean;
  portfolioUpdates: boolean;
}

export interface TradingSettings {
  defaultOrderType: 'market' | 'limit' | 'stop';
  confirmOrders: boolean;
  showAdvancedOptions: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  sharePortfolio: boolean;
  allowAnalytics: boolean;
}