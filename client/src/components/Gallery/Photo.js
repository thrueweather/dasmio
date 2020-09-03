import React from "react";
import Skeleton from "react-loading-skeleton";
import { Checkbox } from "semantic-ui-react";
import _ from "underscore";
import ImageLoader from "react-imageloader";

import { preloader } from "utils";

import close from "assets/white-close.svg";

const Photo = ({
  state,
  photo,
  selectPhoto,
  handleSelectPhoto,
  handleRemoveImage,
  loading,
  cheched,
  setImageFile,
  type,
}) =>
  state.loader ? (
    <div style={{ margin: "4px" }}>
      <Skeleton width={92} height={72} />
    </div>
  ) : typeof photo !== "number" ? (
    <div className="position-relative">
      <div
        className={`gallery-block ${selectPhoto === photo && "active-photo"}`}
      >
        <div onClick={() => handleSelectPhoto(photo)}>
          <ImageLoader
            src={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
            preloader={preloader}
          >
            <div className="gallery-block" />
          </ImageLoader>
        </div>
        {type !== "post" ? (
          !loading && selectPhoto === photo ? null : (
            <div
              className="close-button"
              onClick={() => handleRemoveImage(photo.id)}
            >
              <img src={close} alt="" />
            </div>
          )
        ) : _.isEqual(cheched, photo) ? (
          <div className="select-photo">
            <Checkbox
              checked={Boolean(cheched) || false}
              onChange={() => setImageFile(photo)}
            />
          </div>
        ) : (
          <div
            className="close-button"
            onClick={() => handleRemoveImage(photo.id)}
          >
            <img src={close} alt="" />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="gallery-block" />
  );

export default Photo;
