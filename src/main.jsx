// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from "./context/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";
import { createPortal } from "react-dom";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // <App />
  // </StrictMode>,
  <LoaderProvider>
        {createPortal(<GlobalLoader />, document.body)} {/* Render loader in body */}
        <App />
  </LoaderProvider>
)
