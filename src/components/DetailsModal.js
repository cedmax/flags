import React, { useMemo } from "react";
import Modal from "react-modal";
import Link from "./Link";
import ImageLoader from "./ImageLoader";
import { action, getDetailsImageSize } from "../helpers";
import { getDetailsStyle } from "./modalsStyle";
import { withContext } from "../store/context";

const ChangeView = withContext(
  React.memo(({ url, dispatch, newView }) => (
    <Link
      to={url}
      onClick={e => {
        e.preventDefault();
        dispatch(action("updateDetailsView", newView));
      }}
    >
      {newView}
    </Link>
  ))
);

const NavigationButton = withContext(
  React.memo(({ label, value, dispatch }) => (
    <button onClick={() => dispatch(action("navigate", value))}>
      <span>{label}</span>
    </button>
  ))
);

const DetailsModal = React.memo(({ detail, view, dispatch, isList }) => {
  const ratio = view === "flag" ? detail.ratio : "1:1";
  const size = useMemo(() => getDetailsImageSize(ratio), [ratio]);

  if (!detail) return;
  const flagUrl = require(`../data/flags/${detail.id}.svg`);
  const mapUrl = require(`../data/maps/${detail.id}.png`);

  return (
    <Modal
      style={getDetailsStyle(size)}
      isOpen={!!detail}
      onRequestClose={() => dispatch(action("hideDetails"))}
      contentLabel={detail && detail.country}
      shouldReturnFocusAfterClose={false}
    >
      <ImageLoader
        imgSrc={view === "flag" ? flagUrl : mapUrl}
        view={view}
        {...detail}
      />
      <div className="zoom-controls">
        {isList && <NavigationButton label="prev" value={-1} />}
        <div>
          <h3>{detail.country}</h3>
          <small>
            {view === "map" && <ChangeView newView="flag" url={flagUrl} />}
            {view === "flag" && <ChangeView newView="map" url={mapUrl} />}
          </small>
        </div>
        {isList && <NavigationButton label="next" value={1} />}
      </div>
    </Modal>
  );
});

export default withContext(DetailsModal);
