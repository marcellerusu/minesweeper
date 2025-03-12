import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@/shared/Dialog/Dialog";
import { changeDifficulty } from "@/app/state/game";
import { RootState } from "@/app/store";
import "./Settings.css";

function Hamburger({ onClick }: { onClick: () => void }) {
  return (
    <svg viewBox="0 0 10 10" className="settings-icon" onClick={onClick}>
      <line x1={0} y1={2} x2={10} y2={2} stroke="lightgrey" strokeWidth={1} />
      <line x1={0} y1={5} x2={10} y2={5} stroke="lightgrey" strokeWidth={1} />
      <line x1={0} y1={8} x2={10} y2={8} stroke="lightgrey" strokeWidth={1} />
    </svg>
  );
}

function Settings() {
  let [isOpen, setIsOpen] = useState(false);
  let dispatch = useDispatch();
  let { difficulty } = useSelector((state: RootState) => state.game.settings);

  return (
    <>
      <Hamburger onClick={() => setIsOpen(true)} />
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <form className="settings-form" method="dialog">
          <button className="close">x</button>
          <h1>Settings</h1>
          <select
            name="difficulty"
            defaultValue={difficulty}
            onChange={(e) => {
              dispatch(changeDifficulty(e.currentTarget.value as any));
              setIsOpen(false);
            }}
          >
            <option value="beginner">Beginner (9 x 9 with 10 mines)</option>
            <option value="intermediate">
              Intermediate (16 x 16 with 40 mines)
            </option>
            <option value="expert">Expert (16 x 30 with 99 mines)</option>
          </select>

          <label>
            size
            <input
              type="range"
              min="10"
              max="60"
              onChange={(e) => {
                document.body.style.setProperty(
                  "--cell-size",
                  `${e.currentTarget.value}px`
                );
                localStorage.setItem("--cell-size", e.currentTarget.value);
              }}
            ></input>
          </label>

          <a href="https://github.com/marcellerusu/minesweeper" target="_blank">
            view source
          </a>
        </form>
      </Dialog>
    </>
  );
}

export default Settings;
