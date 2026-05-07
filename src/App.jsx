// src/App.jsx
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GlobalLoader from "./components/GlobalLoader";

function App() {
  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  );
}

export default App;