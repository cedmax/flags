import React, { useMemo } from "react";
import Modal from "react-modal";
import Link from "./Link";
import Loader from "./Loader";
import { action, getDetailsImageSize } from "../helpers";
import { getDetailsStyle } from "./modalsStyle";
import ImageLoader from "react-loading-image";

export default React.memo(({ detail, view, dispatch, isList }) => {
  const ratio = view === "flag" ? detail.ratio : "1:1";
  const size = useMemo(() => getDetailsImageSize(ratio), [ratio]);

  return (
    detail && (
      <Modal
        style={getDetailsStyle(size)}
        isOpen={!!detail}
        onRequestClose={() => dispatch(action("hideDetails"))}
        contentLabel={detail && detail.country}
      >
        <ImageLoader
          loading={() => <Loader />}
          image={props => {
            let size;
            if (view === "flag") {
              delete props.width;
              size = { height: "100%" };
            } else {
              size = { width: "100%" };
              delete props.height;
            }
            return (
              <img
                {...props}
                {...size}
                onClick={() => dispatch(action("hideDetails"))}
                alt={`Flag of ${detail.country}`}
              />
            );
          }}
          src={
            view === "flag"
              ? require(`../data/flags/${detail.id}.svg`)
              : require(`../data/maps/${detail.id}.png`)
          }
        />
        {view === "map" && detail.map && (
          <Link className="map-credits" to={detail.map.credits} target="_blank">
            map
            <br />
            credits
          </Link>
        )}
        <div className="zoom-controls">
          {isList && (
            <button onClick={() => dispatch(action("navigate", -1))}>
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
                    dispatch(action("updateDetailsView", "flag"));
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
                    dispatch(action("updateDetailsView", "map"));
                  }}
                >
                  map
                </Link>
              )}
            </small>
          </div>
          {isList && (
            <button onClick={() => dispatch(action("navigate", 1))}>
              <span>next</span>
            </button>
          )}
        </div>
      </Modal>
    )
  );
});
