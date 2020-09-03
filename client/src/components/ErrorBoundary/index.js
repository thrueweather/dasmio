import React from "react";
import { Button } from "semantic-ui-react";

import Modal from "components/Modal";

import warning from "assets/warning.svg";

import { withPromise } from "utils/index.js";

import "./styles.scss";

const ErrorBoundary = ({ isOpen, toggleModal, submit }) => {
  const handleClick = async () => {
    await withPromise(submit());
    toggleModal();
  };
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      customStyles={{ width: 410, height: 277, paddign: 0 }}
      className="error-boundary"
      content={
        <div className="error-modal text-center">
          <img src={warning} alt="" />
          <h3>Server error</h3>
          <p>
            Oops, something went wrong. Try to refresh this page or feel free to
            contact us if the problem persists.
          </p>
          <Button
            className="primary-button w-100 mt-3"
            style={{ background: "#6EA7F4" }}
            onClick={handleClick}
          >
            Refresh
          </Button>
        </div>
      }
    />
  );
};

export default ErrorBoundary;
