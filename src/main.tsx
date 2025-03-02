import "./style.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Board from "./src/Board/Board";

function App() {
  return <Board />;
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
