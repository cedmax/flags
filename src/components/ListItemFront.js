import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default React.memo(({ svgUrl, country }) => (
  <div className="front">
    <figure>
      <LazyLoadImage width={180} src={svgUrl} alt={`Flag of ${country}`} />
      <figcaption>{country}</figcaption>
    </figure>
  </div>
));
