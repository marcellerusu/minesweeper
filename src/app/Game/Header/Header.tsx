import React from "react";
import MineCounter from "./MineCounter";
import Timer from "./Timer";
import Settings from "./Settings/Settings";
import "./Header.css";

function Header({ status }: { status: "stopped" | "playing" | "reset" }) {
  return (
    <header>
      <MineCounter />
      <Settings />
      <Timer status={status} />
    </header>
  );
}

export default Header;
