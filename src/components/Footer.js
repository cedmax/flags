import React from "react";
import Link from "./Link";

export default React.memo(() => (
  <footer>
    <p>If you find any issue please <Link to="https://github.com/cedmax/flags/issues">get in touch</Link>.</p>
    <p>All the data is from Wikipedia:
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
    , <Link to="https://en.wikipedia.org/wiki/List_of_flag_names">names</Link>,
    and{" "}
    <Link to="https://en.wikipedia.org/wiki/Flags_of_the_U.S._states_and_territories">
      US flags,
    </Link>
    {" "}
    <Link to="https://commons.wikimedia.org/wiki/Locator_maps_for_U.S._states">
      maps
    </Link>{" "}
    and{" "}
    <Link to="https://en.wikipedia.org/wiki/List_of_U.S._state_songs">
      state songs
    </Link>
    .
    </p><p>
    Anthems mostly from{" "}
    <Link to="https://www.youtube.com/user/DeroVolk">DeroVolk</Link>, state
    songs from{" "}
    <Link to="https://www.youtube.com/watch?v=IUgsJKCzcmc&list=PLMQMoYkBxsBpfwjlzH6FJgIpUCJ5G6fsO">
      Music is Love Anthems
    </Link>
    </p>
    <p>
    Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
    <Link to="https://cedmax.com">cedmax</Link>.
    </p>
  </footer>
));
