import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './AppRouter.jsx'
import './index.css'

// GitHub Pages SPA redirect handling
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, null, redirect);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
