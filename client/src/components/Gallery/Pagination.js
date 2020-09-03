import React from "react";

const Pagination = ({ page, numObjects, handleChangePage }) => {
  return (
    <div className="pagination pt-3">
      <div className="d-flex justify-content-center">
        <div
          className={`dot pointer ${page === 1 ? "active" : ""}`}
          onClick={() => handleChangePage(1)}
        ></div>
        <div
          style={{ display: numObjects > 15 ? "block" : "none" }}
          className={`dot pointer mx-2 ${page === 2 ? "active" : ""}`}
          onClick={() => handleChangePage(2)}
        ></div>
        <div
          className={`dot pointer ${page === 3 ? "active" : ""}`}
          style={{ display: numObjects > 30 ? "block" : "none" }}
          onClick={() => handleChangePage(3)}
        ></div>
      </div>
    </div>
  );
};

export default Pagination;
