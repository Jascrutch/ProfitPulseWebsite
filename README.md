# ProfitPulse Trading Dashboard

A comprehensive, modern trading dashboard built with React, TypeScript, and Vite. ProfitPulse provides traders with advanced analytics, real-time market data, portfolio management, and a seamless user experience across all devices.

![ProfitPulse Dashboard](https://github.com/user-attachments/assets/0fc4c60a-d7be-4306-bc94-c4a321b9dfc9)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication System** with JWT token storage
- **Role-based Access Control** (Admin, Trader, Guest roles)
- **Demo Accounts** for testing different permission levels
- **Session Management** with automatic token refresh
- **Password Validation** with strength requirements

### 📊 Dashboard & Analytics
- **Real-time Portfolio Overview** with live updates
- **Performance Metrics** including P&L, ROI, and daily changes
- **Interactive Charts** and data visualizations
- **Market Data Integration** via WebSocket connections
- **Responsive Design** optimized for all screen sizes

### 💼 Portfolio Management
- **Live Position Tracking** with real-time price updates
- **Portfolio Analytics** with detailed performance metrics
- **Asset Allocation** visualization and analysis
- **Historical Performance** tracking and reporting

### 📈 Trading Features
- **Watchlist Management** with symbol search and filtering
- **Real-time Price Updates** for tracked symbols
- **Order Management** (coming soon)
- **Trade History** tracking and analysis (coming soon)
- **CSV Export** functionality for data portability

### 🔔 Notifications & Alerts
- **Real-time Notifications** for price alerts and trade updates
- **Notification Center** with filtering and management
- **Customizable Alerts** for portfolio events
- **Email & Push Notifications** (coming soon)

### ♿ Accessibility & UX
- **High Contrast Mode** for visual accessibility
- **Keyboard Navigation** support throughout the app
- **ARIA Labels** and semantic HTML structure
- **Responsive Design** with mobile-first approach
- **Screen Reader** compatibility

### 🎯 Advanced Features
- **Guided Onboarding** for new users with interactive tutorials
- **Error Boundary** system for robust error handling
- **Maintenance Mode** banner for system updates
- **WebSocket Service** for real-time data streaming
- **Local Storage** persistence for user preferences

### 📚 Help & Support
- **Comprehensive FAQ** with searchable content
- **Collapsible Help Articles** organized by category
- **Contact Support** system (coming soon)
- **API Documentation** (coming soon)

### 🛡️ Legal & Compliance
- **Terms of Service** page
- **Privacy Policy** documentation
- **Trading Disclaimers** and risk warnings
- **Compliance-ready** structure for financial regulations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jascrutch/ProfitPulseWebsite.git
   cd ProfitPulseWebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Accounts

Try different user roles with these demo accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@profitpulse.com | demo123 | Full system access + API docs |
| **Trader** | trader@profitpulse.com | demo123 | Trading + portfolio management |
| **Guest** | guest@profitpulse.com | demo123 | View-only access |

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API with custom hooks
- **Styling**: CSS-in-JS with styled-jsx
- **Real-time**: WebSocket service layer
- **Storage**: LocalStorage for persistence

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── MaintenanceBanner.tsx
│   └── OnboardingModal.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── hooks/              # Custom React hooks
│   └── index.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Notifications.tsx
│   ├── Watchlist.tsx
│   ├── Help.tsx
│   └── PlaceholderPages.tsx
├── services/           # External service integrations
│   └── websocket.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── styles/             # Global styles
│   └── global.css
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Key Features Implementation

#### Authentication System
- Secure token storage with session management
- Role-based route protection
- Automatic token refresh
- Demo account system for testing

#### Real-time Data
- WebSocket service with automatic reconnection
- Live price updates for watchlist items
- Real-time portfolio value calculations
- Market data simulation for demo purposes

#### Accessibility
- WCAG 2.1 compliance features
- High contrast mode toggle
- Keyboard navigation support
- Screen reader optimization

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Maintenance mode
MAINTENANCE_MODE=false

# API endpoints (for future backend integration)
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_TRADING=true
```

### Development Guidelines

1. **TypeScript**: All components must be properly typed
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Responsive**: Mobile-first design approach
4. **Error Handling**: Use error boundaries and proper error states
5. **Performance**: Optimize for fast loading and smooth interactions

## 📱 Responsive Design

ProfitPulse is fully responsive and optimized for:
- **Desktop** (1200px+): Full feature set with sidebar navigation
- **Tablet** (768px-1199px): Adapted layout with collapsible sidebar
- **Mobile** (320px-767px): Mobile-optimized interface with bottom navigation

## 🔒 Security Features

- **Secure Authentication**: JWT tokens with secure storage
- **Role-based Access**: Granular permission system
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Token-based request validation
- **Session Management**: Automatic logout on inactivity

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core dashboard and authentication
- ✅ Watchlist and notifications
- ✅ Help system and accessibility features
- ✅ Responsive design and error handling

### Phase 2 (Next)
- 🔄 Advanced trading interface
- 🔄 Order management system
- 🔄 Advanced analytics and charting
- 🔄 Portfolio optimization tools

### Phase 3 (Future)
- 📅 Backend API integration
- 📅 Real market data feeds
- 📅 Advanced order types
- 📅 Social trading features
- 📅 Mobile application

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

1. Follow the installation steps above
2. Create a new branch for your feature
3. Make your changes with proper TypeScript typing
4. Ensure all tests pass and add new tests for your features
5. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@profitpulse.com
- 🐛 Issues: [GitHub Issues](https://github.com/Jascrutch/ProfitPulseWebsite/issues)
- 📖 Documentation: [API Docs](https://api.profitpulse.com/docs)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **TypeScript Team** for type safety
- **Contributors** who help improve ProfitPulse

---

**ProfitPulse** - Empowering traders with intelligent insights and seamless execution.