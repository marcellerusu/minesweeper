import "./style.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "./src/Game";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Game />
  </StrictMode>
);
