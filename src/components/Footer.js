import React from "react";
import Link from "./Link";

export default React.memo(() => (
  <footer>
    All the data is from Wikipedia:
    <br />
    <Link to="https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags">
      flags
    </Link>
    ,{" "}
    <Link to="https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_current_flag_adoption">
      adoption years
    </Link>
    ,{" "}
    <Link to="https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent">
      per continent
    </Link>
    ,{" "}
    <Link to="https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags">
      ratios
    </Link>
    , <Link to="https://en.wikipedia.org/wiki/List_of_flag_names">names</Link>
    .
    <br />
    Anthems mostly from{" "}
    <Link to="https://www.youtube.com/user/DeroVolk">DeroVolk, on YouTube</Link>
    <br />
    <br />
    Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
    <Link to="https://cedmax.com">cedmax</Link>.
  </footer>
));