import React from "react";
import DetailsList from "./DetailsList";
import DetailsHeader from "./DetailsHeader";
import { withContext } from "../store/context";

const ListItemBack = React.memo(({ view, svgUrl, flag, active }) => (
  <div className="back">
    <div
      style={{
        backgroundImage: `url(${svgUrl})`,
      }}
    >
      <DetailsHeader flag={flag} active={active} />
      <DetailsList
        anthemTitle={view === "US" ? "State Song" : "Anthem"}
        flag={flag}
      />
    </div>
  </div>
));

export default withContext(ListItemBack);
