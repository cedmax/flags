import React from "react";
import Modal from "react-modal";
import Link from "./Link";
import { actionObject } from "../store/helpers";

const getSize = ratioString => {
  const ratioParts = ratioString.split(":");
  const ratio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);

  const { clientHeight, clientWidth } = document.documentElement;

  let flagHeight = (clientHeight / 100) * 60;
  let flagWidth = flagHeight / ratio;

  const maxWidth = (clientWidth / 100) * 70;
  if (flagWidth > maxWidth) {
    flagWidth = maxWidth;
    flagHeight = flagWidth * ratio;
  }

  return {
    width: flagWidth,
    height: flagHeight,
  };
};

export default React.memo(
  ({ detail, view, dispatch, isList }) =>
    detail && (
      <Modal
        style={{
          overlay: {
            zIndex: 1500,
            background: "rgba(255,255,255,.9)",
          },
          content: {
            ...getSize(view === "flag" ? detail.ratio : "1:1"),
            background: "transparent",
            border: "0",
            padding: 0,
            top: "50%",
            left: "50%",
            transform: "translate3d(-50%, -50%, 0)",
            overflow: "visible",
          },
        }}
        isOpen={!!detail}
        onRequestClose={() => dispatch(actionObject("hideDetails"))}
        contentLabel={detail && detail.country}
      >
        <img
          onClick={() => dispatch(actionObject("hideDetails"))}
          height="100%"
          src={
            view === "flag"
              ? require(`../data/flags/${detail.id}.svg`)
              : require(`../data/maps/${detail.id}.png`)
          }
          alt={`Flag of ${detail.country}`}
        />
        {view === "map" && (
          <Link className="map-credits" to={detail.map.credits} target="_blank">
            map
            <br />
            credits
          </Link>
        )}
        <div className="zoom-controls">
          {isList && (
            <button onClick={() => dispatch(actionObject("navigate", -1))}>
              <span>prev</span>
            </button>
          )}
          <div>
            <h3>{detail.country}</h3>
            <small>
              {view === "map" && (
                <Link
                  to={require(`../data/flags/${detail.id}.svg`)}
                  onClick={e => {
                    e.preventDefault();
                    dispatch(actionObject("updateDetailsView", "flag"));
                  }}
                >
                  flag
                </Link>
              )}
              {view === "flag" && (
                <Link
                  to={require(`../data/maps/${detail.id}.png`)}
                  onClick={e => {
                    e.preventDefault();
                    dispatch(actionObject("updateDetailsView", "map"));
                  }}
                >
                  map
                </Link>
              )}
            </small>
          </div>
          {isList && (
            <button onClick={() => dispatch(actionObject("navigate", 1))}>
              <span>next</span>
            </button>
          )}
        </div>
      </Modal>
    )
);
