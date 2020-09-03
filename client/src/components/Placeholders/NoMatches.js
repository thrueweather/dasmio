import React from "react";

const NoMatches = ({ title, subtitle, children }) => (
  <div className="no-matches-wrapp">
    <div className="no-matches-content">
      <h1>{title}</h1>
      <div className="d-flex justify-content-center text-left">
        <div style={{ width: 280, opacity: 0 }}>.</div>
        {subtitle}
      </div>
      {children}
    </div>
  </div>
);

export default NoMatches;
