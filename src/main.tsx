import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { store } from "./app/store";
import Game from "./app/Game/Game";
import "./style.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Provider store={store}>
      <Game />
    </Provider>
  </StrictMode>
);
