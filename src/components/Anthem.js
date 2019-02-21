import React from "react";
import Modal from "react-modal";
import { action } from "../helpers";
import { anthemStyle } from "./modalsStyle";

export default React.memo(
  ({ playing, dispatch }) =>
    playing && (
      <Modal
        style={anthemStyle}
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
