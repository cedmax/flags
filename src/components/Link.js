import React from "react";

export default React.memo(({ to, children, onClick, className }) => (
  <a
    href={to}
    className={className}
    onClick={
      onClick
        ? (e) => {
            e.preventDefault();
            onClick(e);
          }
        : null
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
));
