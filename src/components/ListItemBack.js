import React from "react";
import DetailsList from "./DetailsList";
import DetailsHeader from "./DetailsHeader";

const ListItemBack = React.memo(({ isUS, imgs, flag, active }) => (
  <div className="back">
    <div
      style={{
        backgroundImage: `url(${imgs.flag})`,
      }}
    >
      <DetailsHeader imgs={imgs} flag={flag} active={active} />
      <DetailsList anthemTitle={isUS ? "State Song" : "Anthem"} flag={flag} />
    </div>
  </div>
));

export default ListItemBack;
