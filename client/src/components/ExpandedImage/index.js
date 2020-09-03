import React, { useState } from "react";

import Lightbox from "react-image-lightbox";

import Modal from "components/Modal";

import "./styles.scss";
import "react-image-lightbox/style.css";

const ExpandedImage = ({ isOpen, toggleModal, photo, mode }) => {
  const [status, setStatus] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleCloseModal = () => {
    toggleModal();
    setStatus(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggleModal={handleCloseModal}
      customStyles={
        mode === "photo" ? { width: 469, height: 380 } : { width: 600 }
      }
      className="expanded-image"
      content={
        photo && (
          <Lightbox
            mainSrc={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
            nextSrc={photo[(photoIndex + 1) % photo.length]}
            prevSrc={photo[(photoIndex + photo.length - 1) % photo.length]}
            onCloseRequest={toggleModal}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + photo.length - 1) % photo.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % photo.length)
            }
          />
        )
      }
    />
  );
};

export default ExpandedImage;
