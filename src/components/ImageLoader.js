import React, { Fragment } from "react";
import Loader from "./Loader";
import ImageLoader from "react-loading-image";
import { action } from "../helpers";
import Link from "./Link";
import { withContext } from "../store/context";

const ImageLoaderUI = React.memo(
  ({ type, view, dispatch, country, imgSrc, map }) => (
    <Fragment>
      <ImageLoader
        loading={() => <Loader />}
        image={props => {
          let size;
          if ((view === "US" || view === "ES") && type === "map") {
            size = { width: "100%" };
            delete props.height;
          } else {
            delete props.width;
            size = { height: "100%" };
          }
          return (
            <img
              {...props}
              {...size}
              onClick={() => dispatch(action("hideDetails"))}
              alt={`Flag of ${country}`}
            />
          );
        }}
        src={imgSrc}
      />
      {type === "map" && map && (
        <Link className="map-credits" to={map.credits} target="_blank">
          map
          <br />
          credits
        </Link>
      )}
    </Fragment>
  )
);

export default withContext(ImageLoaderUI);
