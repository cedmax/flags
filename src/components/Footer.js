import React from "react";
import Link from "./Link";

export default React.memo(() => (
  <footer>
    <p>
      All the data is from Wikipedia:
      <br />
      <Link to="https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags">
        sovereign states
      </Link>{" "}
      and{" "}
      <Link to="https://en.wikipedia.org/wiki/Flags_of_country_subdivisions">
        country subdivisions
      </Link>
      .
    </p>
    <p>
      If you find any issue please{" "}
      <Link to="https://github.com/cedmax/flags/issues">get in touch</Link>.
    </p>
    <p>
      Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
      <Link to="https://cedmax.com">cedmax</Link>.
    </p>
  </footer>
));
