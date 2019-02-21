import React from "react";
import Modal from "react-modal";
import { action } from "../helpers";

export default React.memo(
  ({ playing, dispatch }) =>
    playing && (
      <Modal
        style={{
          overlay: {
            zIndex: 1000,
            background: "transparent",
            pointerEvents: "none",
          },
          content: {
            pointerEvents: "all",
            width: 240,
            height: 135,
            border: 0,
            padding: 0,
            right: 20,
            top: "auto",
            left: "auto",
            bottom: 20,
            overflow: "visible",
          },
        }}
        isOpen={!!playing}
        onRequestClose={() => dispatch(action("play", null))}
      >
        <button
          onClick={() => dispatch(action("play", null))}
          className="close"
        >
          <span>close</span>
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${playing}?autoplay=1`}
          allow="autoplay"
          frameBorder="0"
          height="100%"
          width="100%"
          title="anthem"
        />
      </Modal>
    )
);
