import React from "react";
import MineCounter from "./MineCounter/MineCounter";
import Timer from "./Timer/Timer";
import "./Header.css";

function Header({ status }: { status: "stopped" | "playing" | "reset" }) {
  return (
    <header>
      <MineCounter />
      <Timer status={status} />
    </header>
  );
}

export default Header;
