import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeProvider'
import App from './App'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="cortez-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
