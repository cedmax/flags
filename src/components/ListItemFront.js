import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default React.memo(({ svgUrl, country, belongsTo }) => (
  <div className="front">
    <figure>
      <LazyLoadImage
        placeholder={<div className="spinner spinner-small" />}
        src={svgUrl}
        alt={`Flag of ${country}`}
      />
      <figcaption>
        {country}
        {belongsTo && <span> ({belongsTo})</span>}
      </figcaption>
    </figure>
  </div>
));
