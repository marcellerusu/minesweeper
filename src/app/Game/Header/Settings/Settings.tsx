import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeDifficulty } from "@/app/state/game";
import "./Settings.css";
import { RootState } from "@/app/store";

function Gear({ onClick }: { onClick: () => void }) {
  return (
    <svg viewBox="0 0 10 10" className="settings-icon" onClick={onClick}>
      <line x1={0} y1={2} x2={10} y2={2} stroke="lightgrey" strokeWidth={1} />
      <line x1={0} y1={5} x2={10} y2={5} stroke="lightgrey" strokeWidth={1} />
      <line x1={0} y1={8} x2={10} y2={8} stroke="lightgrey" strokeWidth={1} />
    </svg>
  );
}

function SettingsForm({ onClose }: { onClose: () => void }) {
  let dispatch = useDispatch();
  let { difficulty } = useSelector((state: RootState) => state.game.settings);
  return (
    <form className="settings-form">
      <button
        className="close"
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        x
      </button>
      <h1>Settings</h1>
      <select
        name="difficulty"
        defaultValue={difficulty}
        onChange={(e) => {
          let { difficulty } = e.currentTarget.closest("form")!.elements as any;
          dispatch(changeDifficulty(difficulty.value));
          onClose();
        }}
      >
        <option value="beginner">Beginner (9 x 9 with 10 mines)</option>
        <option value="intermediate">
          Intermediate (16 x 16 with 40 mines)
        </option>
        <option value="expert">Expert (16 x 30 with 99 mines)</option>
      </select>
    </form>
  );
}

function Settings() {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Gear onClick={() => setIsOpen(true)} />
      {isOpen && <SettingsForm onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default Settings;
