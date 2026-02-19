import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter as Router } from 'react-router-dom';
import AppContextProvider from "./context/AppContext.tsx";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL
console.log(import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Router>
  </StrictMode>
);
