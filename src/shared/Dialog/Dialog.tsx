import React, {
  DialogHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";

function Dialog({
  children,
  open,
  ...props
}: PropsWithChildren<{ open: boolean }> &
  DialogHTMLAttributes<HTMLDialogElement>) {
  let ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (open) {
      ref.current!.showModal();
    } else {
      ref.current!.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onMouseDown={(e) => {
        // it appears that when the dialog is open
        // it takes up the size of the entire screen
        // and if you click, and it's not matching something directly inside the dialog
        // like the form then it must be clicking on the backdrop
        // and so we can close the dialog
        let clickedOn = e.target as HTMLElement;
        if (clickedOn.matches("dialog")) ref.current!.close();
      }}
      {...props}
    >
      {children}
    </dialog>
  );
}

export default Dialog;
