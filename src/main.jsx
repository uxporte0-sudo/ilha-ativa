import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import PresentationOverlay from '@/components/demo/PresentationOverlay'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <PresentationOverlay />
  </>
)
