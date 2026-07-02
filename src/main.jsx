import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LubIQ from './LubIQ.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LubIQ />
  </StrictMode>,
)
