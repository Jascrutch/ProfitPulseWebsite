import React from 'react';

// Re-export the real components we've created
export { default as Notifications } from './Notifications';
export { default as Watchlist } from './Watchlist';
export { default as Help } from './Help';

// Create placeholder components for remaining pages
const createPlaceholderPage = (title: string, description: string) => () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

export const Trading = createPlaceholderPage('Trading', 'Trading interface coming soon...');
export const Portfolio = createPlaceholderPage('Portfolio', 'Portfolio overview coming soon...');
export const OrderHistory = createPlaceholderPage('Order History', 'Trade history coming soon...');
export const Analytics = createPlaceholderPage('Analytics', 'Advanced analytics coming soon...');
export const Profile = createPlaceholderPage('Profile', 'User profile settings coming soon...');
export const Contact = createPlaceholderPage('Contact Support', 'Contact form coming soon...');
export const ApiDocs = createPlaceholderPage('API Documentation', 'API documentation coming soon...');
export const Terms = createPlaceholderPage('Terms of Service', 'Legal terms coming soon...');
export const Privacy = createPlaceholderPage('Privacy Policy', 'Privacy policy coming soon...');
export const Disclaimers = createPlaceholderPage('Disclaimers', 'Legal disclaimers coming soon...');

export default Trading;