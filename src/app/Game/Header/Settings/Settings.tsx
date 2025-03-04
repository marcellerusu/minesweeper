import React, { useRef } from "react";
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

function Settings() {
  let dialog = useRef<HTMLDialogElement>(null);
  let dispatch = useDispatch();
  let { difficulty } = useSelector((state: RootState) => state.game.settings);

  return (
    <>
      <Gear onClick={() => dialog.current!.showModal()} />
      <dialog
        ref={dialog}
        onMouseDown={(e) => {
          // it appears that when the dialog is open
          // it takes up the size of the entire screen
          // and if you click, and it's not matching something directly inside the dialog
          // like the form then it must be clicking on the backdrop
          // and so we can close the dialog
          let clickedOn = e.target as HTMLElement;
          if (clickedOn.matches("dialog")) dialog.current!.close();
        }}
      >
        <form className="settings-form" method="dialog">
          <button className="close">x</button>
          <h1>Settings</h1>
          <select
            name="difficulty"
            defaultValue={difficulty}
            onChange={(e) => {
              let { difficulty } = e.currentTarget.closest("form")!
                .elements as any;
              dispatch(changeDifficulty(difficulty.value));
              dialog.current!.close();
            }}
          >
            <option value="beginner">Beginner (9 x 9 with 10 mines)</option>
            <option value="intermediate">
              Intermediate (16 x 16 with 40 mines)
            </option>
            <option value="expert">Expert (16 x 30 with 99 mines)</option>
          </select>
        </form>
      </dialog>
    </>
  );
}

export default Settings;
