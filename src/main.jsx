import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/app.scss";
import App from './App.jsx'
import { StoreProvider } from './store/StoreContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)
