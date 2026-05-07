// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from "./context/LoaderContext";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // <App />
  // </StrictMode>,
  <LoaderProvider>
        <App />
  </LoaderProvider>,
)
