import React from "react";

import SupportPageWrapp from "./Support/index";

import oops from "assets/oops.svg";

const ServerError = () => (
  <SupportPageWrapp>
    <div className="sercer-error-wrapp">
      <div className="sercer-error-content">
        <img src={oops} alt="" />
        <div className="d-flex justify-content-center text-left">
          <div style={{ width: 0, opacity: 0 }}>.</div>
          <h3>Something wrong there...</h3>
        </div>
        <div
          className="text-left"
          style={{ width: 388, margin: "auto", marginLeft: 340, marginTop: 20 }}
        >
          {" "}
          <span>
            Sorry, we`re having some technical issues (as you can see) <br />{" "}
            try to refresh the page, sometime works :)
          </span>
        </div>
      </div>
    </div>
  </SupportPageWrapp>
);

export default ServerError;
