import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
//link fontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";
//link bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
// link main style
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
