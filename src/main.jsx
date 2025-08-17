import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'

function App() {
  return (
    <div className="container">
      <h1>Profit Pulse Website</h1>
      <p>Welcome to the Profit Pulse Website! This project provides insights and analytics related to profit trends in various industries.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)