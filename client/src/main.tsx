import React from "react";
// sanity log to confirm main module executed
console.log("main.tsx module loaded");
import ReactDOM from "react-dom/client";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import Doc from "./pages/Doc.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/doc/:id" element={<Doc />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
