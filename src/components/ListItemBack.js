import React from "react";
import DetailsList from "./DetailsList";
import DetailsHeader from "./DetailsHeader";
import { withContext } from "../store/context";

const ListItemBack = React.memo(({ view, imgs, flag, active }) => (
  <div className="back">
    <div
      style={{
        backgroundImage: `url(${imgs.flag})`,
      }}
    >
      <DetailsHeader imgs={imgs} flag={flag} active={active} />
      <DetailsList
        anthemTitle={view === "US" ? "State Song" : "Anthem"}
        flag={flag}
      />
    </div>
  </div>
));

export default withContext(ListItemBack);
