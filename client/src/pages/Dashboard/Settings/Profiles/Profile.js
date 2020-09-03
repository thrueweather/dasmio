import React, { useState, useEffect } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { Link } from "react-router-dom";
import Lightbox from "react-image-lightbox";

import trash from "assets/trash-outline.svg";
import edit from "assets/mdi-light_pencil.svg";
import education from "assets/school.svg";
import job from "assets/briefcase-outline.svg";
import userIcon from "assets/person.svg";
import document from "assets/document-text.svg";
import removeIcon from "assets/remove-icon.svg";

import { TIME_DURATION } from "constants/index";
import * as path from "constants/routes";

import { withPromise, getMilliseconds } from "utils/index";

import "react-circular-progressbar/dist/styles.css";
import "react-image-lightbox/style.css";

const Profile = (profile) => {
  const [percentage, setPercentage] = useState(0);
  const [inProgress, toggleProgress] = useState(false);
  const [avatarModal, toggleAvatarModal] = useState(false);

  const { avatar, name, user } = profile;

  useEffect(() => {
    if (percentage === 0) return;

    const timer = setTimeout(() => {
      setPercentage(0);
      toggleProgress(false);
    }, TIME_DURATION);

    return () => clearTimeout(timer);
  }, [percentage]);

  const handleSetTime = async () => {
    await withPromise(toggleProgress(true));

    setPercentage(100);
  };

  const stopTimer = () => {
    toggleProgress(false);
    setPercentage(0);
  };

  const imageLoading = (
    <div className={`ril__image ril-not-loaded`}>
      <div className="ril__loadingContainer">
        <div className="ril-loading-circle ril__loadingCircle ril__loadingContainer__icon">
          {[...new Array(12)].map((_, index) => (
            <div
              key={index}
              className="ril-loading-circle-point ril__loadingCirclePoint"
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile">
      <div className="head text-center">
        <div className="d-flex justify-content-center align-items-center">
          {!inProgress ? (
            <div className="icon remove" onClick={handleSetTime}>
              <img src={trash} alt="" />
            </div>
          ) : (
            <div
              style={{ width: 48, height: 48 }}
              className="pointer"
              onClick={stopTimer}
            >
              <CircularProgressbarWithChildren
                value={percentage}
                styles={buildStyles({
                  rotation: 0,
                  pathTransitionDuration: getMilliseconds(TIME_DURATION),
                  pathColor: `rgba(243, 116, 116, 1)`,
                  trailColor: "rgba(243, 116, 116, 0.2)",
                  backgroundColor: "rgba(243, 116, 116, 0.2)",
                })}
              >
                <img src={removeIcon} alt="" />
              </CircularProgressbarWithChildren>
            </div>
          )}
          <img
            src={`${process.env.REACT_APP_CONST_BACKEND}/media/${avatar.image}`}
            onClick={() => toggleAvatarModal(true)}
            className="avatar pointer"
            alt=""
          />
          <Link
            to={path.EDIT_PROFILE}
            to={{
              pathname: path.EDIT_PROFILE,
              state: { ...profile },
            }}
          >
            <div className="icon edit">
              <img src={edit} alt="" />
            </div>
          </Link>
        </div>
        <h2 className="m-0 mt-2">{name}</h2>
        <p className="m-0">{user.email}</p>
      </div>
      <div className="body">
        <h3>Profile information</h3>
        <div className="list">
          <div className="item">
            <img src={education} alt="" />
            <p>{profile.education}</p>
          </div>
          <div className="item">
            <img src={job} alt="" />
            <p>{profile.job}</p>
          </div>
          <div className="item">
            <img src={userIcon} alt="" />
            <p>Age: {profile.age} y.o.</p>
          </div>
          <div className="item">
            <img src={document} alt="" />
            <p>{profile.description}</p>
          </div>
        </div>
      </div>
      {avatarModal && (
        <Lightbox
          mainSrc={`${process.env.REACT_APP_CONST_BACKEND}/media/${avatar.source.image}`}
          imageLoadErrorMessage={imageLoading}
          onCloseRequest={() => toggleAvatarModal(false)}
          enableZoom={false}
        />
      )}
    </div>
  );
};

export default Profile;
