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
        image={(props) => {
          let size;
          delete props.height;
          delete props.width;
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
      {type === "map" && map && map.credits && (
        <Link className="map-credits" to={map.credits} target="_blank">
          map credits
        </Link>
      )}
    </Fragment>
  )
);

export default withContext(ImageLoaderUI);
