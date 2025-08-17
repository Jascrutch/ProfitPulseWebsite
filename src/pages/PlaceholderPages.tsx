import React from 'react';

// Create placeholder components for all pages
const createPlaceholderPage = (title: string, description: string) => () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

export const Trading = createPlaceholderPage('Trading', 'Trading interface coming soon...');
export const Portfolio = createPlaceholderPage('Portfolio', 'Portfolio overview coming soon...');
export const Watchlist = createPlaceholderPage('Watchlist', 'Stock watchlist coming soon...');
export const OrderHistory = createPlaceholderPage('Order History', 'Trade history coming soon...');
export const Notifications = createPlaceholderPage('Notifications', 'Notification center coming soon...');
export const Analytics = createPlaceholderPage('Analytics', 'Advanced analytics coming soon...');
export const Profile = createPlaceholderPage('Profile', 'User profile settings coming soon...');
export const Help = createPlaceholderPage('Help & FAQ', 'Help documentation coming soon...');
export const Contact = createPlaceholderPage('Contact Support', 'Contact form coming soon...');
export const ApiDocs = createPlaceholderPage('API Documentation', 'API documentation coming soon...');
export const Terms = createPlaceholderPage('Terms of Service', 'Legal terms coming soon...');
export const Privacy = createPlaceholderPage('Privacy Policy', 'Privacy policy coming soon...');
export const Disclaimers = createPlaceholderPage('Disclaimers', 'Legal disclaimers coming soon...');

export default Trading;