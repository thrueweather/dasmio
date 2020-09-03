import React from "react";

import logo from "../../assets/logo.svg";

import "./style.scss";

const SupportPageWrapp = ({ children }) => {
  return (
    <div className="support">
      <div className="header text-center">
        <img src={logo} alt="" />
      </div>
      <div className="content-wrapp">
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default SupportPageWrapp;
