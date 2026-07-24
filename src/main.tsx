import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeProvider'
import App from './App'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="studypilot-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
