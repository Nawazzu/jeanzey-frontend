import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
// Instead of importing everything, import only what you use
import '@fontsource/playfair-display/400.css';  // regular
import '@fontsource/playfair-display/700.css';  // bold (if used)
import '@fontsource/lora/400.css';              // regular
import '@fontsource/lora/700.css';              // bold (if used)


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <HelmetProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </HelmetProvider>
  </BrowserRouter>,
)