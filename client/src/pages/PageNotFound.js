import React from "react";
import svgLogo from "assets/404.svg";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div className="text-center">
        <img src={svgLogo} alt="" />
        <p className="mt-5">
          Welcome to page 404! You are here because you entered the address of a
          page <br />
          that no longer exists or has been moved to another address
        </p>
      </div>
    </div>
  );
};

export default PageNotFound;
