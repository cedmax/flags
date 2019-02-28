import React from "react";
import Link from "./Link";
import { action } from "../helpers";
import { withContext } from "../store/context";

const FlagActions = withContext(
  React.memo(({ id, country, dispatch }) => (
    <small>
      <Link
        to={`/?detail=${id}&detailView=flag`}
        onClick={() =>
          dispatch(
            action("showDetails", {
              id,
              detailView: "flag",
            })
          )
        }
      >
        zoom
      </Link>{" "}
      <Link to={`https://en.wikipedia.org/wiki/${country.replace(/\s/g, "_")}`}>
        wiki
      </Link>
    </small>
  ))
);

const MapLink = withContext(({ dispatch, url, id, country }) => (
  <Link
    to={url}
    onClick={() =>
      dispatch(
        action("showDetails", {
          id,
          detailView: "map",
        })
      )
    }
  >
    <img alt={`${country} location map`} src={url} />
  </Link>
));

const DetailsHeader = React.memo(({ flag, active }) => (
  <div className="flag-header">
    <div className="flag-map">
      {active && (
        <MapLink
          url={require(`../data/maps/_thumbs/${flag.id}.png`)}
          id={flag.id}
          country={flag.country}
        />
      )}
    </div>
    <div className="flag-title">
      <h3>{flag.country}</h3>
      <FlagActions country={flag.country} id={flag.id} />
    </div>
  </div>
));

export default DetailsHeader;
