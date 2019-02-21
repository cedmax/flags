import React from "react";

export default React.memo(({ svgUrl, country }) => (
  <div className="front">
    <figure>
      <img width={180} src={svgUrl} alt={`Flag of ${country}`} />
      <figcaption>{country}</figcaption>
    </figure>
  </div>
));
