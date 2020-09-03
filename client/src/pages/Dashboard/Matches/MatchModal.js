import React from "react";
import { Link } from "react-router-dom";
import { Image, Button } from "semantic-ui-react";

import Modal from "components/Modal";

import "./style.scss";

const MatchModal = ({ isOpen, toggleModal, activeProfile, user, refresh , room}) => {
  const backToMatches = () => {
    toggleModal({ isOpen: false, data: null });
    refresh();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggleModal={backToMatches}
      customStyles={{
        width: 398,
        height: 480,
        borderRadius: 20
      }}
      className="match-modal"
      content={
        <div className="match-modal-wrapp text-center h-100">
          <h1>It`s a Match!</h1>
          <p>{`You and ${user &&
            user.name.split(" ")[0]} have liked each other`}</p>
          <div className="avatars">
            <Image
              src={`${process.env.REACT_APP_CONST_BACKEND}/media/${user &&
                user.avatar.image}`}
              className="pointer"
              avatar
            />
            <Image
              src={`${process.env.REACT_APP_CONST_BACKEND}/media/${activeProfile[0].avatar.image}`}
              className="pointer"
              avatar
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <Link
              className="send-button"
              to={{
                pathname: "/messages",
                state: {room}
              }}
            >
              Send message
            </Link>
            <Button className="back-button" onClick={backToMatches}>
              Back to matches
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default MatchModal;
