import "./style.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "./app/Game";
import { store } from "./app/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Provider store={store}>
      <Game />
    </Provider>
  </StrictMode>
);
