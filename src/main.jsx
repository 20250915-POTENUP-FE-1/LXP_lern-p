import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App.jsx";
import { StrictMode } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
