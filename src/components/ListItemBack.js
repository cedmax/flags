import React from "react";
import DetailsList from "./DetailsList";
import DetailsHeader from "./DetailsHeader";
import { withContext } from "../store/context";
import { disableMap } from "../helpers";

const ListItemBack = React.memo(({ view, svgUrl, flag, active }) => (
  <div className="back">
    <div
      style={{
        backgroundImage: `url(${svgUrl})`,
      }}
    >
      <DetailsHeader
        flag={flag}
        active={active}
        disableMap={disableMap(view)}
      />
      <DetailsList
        disableAnthem={view === "" || !view}
        anthemTitle={view === "US" ? "State Song" : "Anthem"}
        partOfTitle={view === "AUTONOMIST" ? "Secession from" : "Part of"}
        flag={flag}
      />
    </div>
  </div>
));

export default withContext(ListItemBack);
