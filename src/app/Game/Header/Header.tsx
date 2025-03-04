import React from "react";
import MineCounter from "./MineCounter";
import Timer from "./Timer";
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
