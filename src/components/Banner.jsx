import React from "react";
import { memo } from "react";

const ShamelessPlug = () => (
  <a
    className="banner"
    href="https://www.crowdfunder.co.uk/landing-short-film"
    target="_blank"
    rel="noopener noreferrer"
  >
    <strong>Shameless Plug:</strong> Please support{" "}
    <em>
      <strong>Landing</strong>
    </em>
    , an independent movie produced by an amazing Italian director
  </a>
);

export default memo(ShamelessPlug);
