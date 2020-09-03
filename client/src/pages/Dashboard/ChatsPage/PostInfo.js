import React from "react";

import { Button } from "semantic-ui-react";
import { Carousel } from "react-responsive-carousel";

import profileAvatar from "assets/profile-avatar.svg";

import document from "assets/black-document-text-outline.svg";
import school from "assets/black-school-outline.svg";
import briefcase from "assets/black-briefcase-outline.svg";
import person from "assets/black-person-outline.svg";

const PostInfo = (props) => {
  return (
    <div className={"right-section"}>
      <div className={"post-content"}>
        <div className={"post-images"}>
          {props.data ? (
            <>
              {props.data.photos.length > 1 ? (
                <Carousel
                  showArrows={false}
                  showThumbs={false}
                  showStatus={false}
                >
                  {props.data.photos.map((photo) => (
                    <div
                    // onClick={() => handleSetPhoto(props.data.photos, "slider")}
                    >
                      <img
                        className="w-100 pointer"
                        src={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
                        alt="Post images"
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div
                // onClick={() => handleSetPhoto(photo, "photo")}
                >
                  <img
                    className="w-100 pointer cover"
                    style={{ maxHeight: "300px" }}
                    src={`${process.env.REACT_APP_CONST_BACKEND}/media/${props.data.photos[0].image}`}
                    alt="Post images"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div
              // onClick={() => handleSetPhoto(props.data.photos, "slider")}
              >
                <img
                  className="w-100 pointer cover"
                  style={{ maxHeight: "300px" }}
                  src={profileAvatar}
                  alt="Post images"
                />
              </div>
            </>
          )}
        </div>
        <div className={"post-info"}>
          <h3>Post description</h3>
          <p>{props.data ? props.data.text : "Description"}</p>
        </div>
        <div className={"profile-info"}>
          <div className={"profile-name"}>
            <img
              src={
                props.data
                  ? `${process.env.REACT_APP_CONST_BACKEND}/media/${props.data.profile.avatar.image}`
                  : profileAvatar
              }
              alt="Avatar"
            />
            <h5>{props.data ? props.data.profile.name : "Profile name"}</h5>
          </div>
          <div className={"profile-description"}>
            <h3>Profile information</h3>
            <ul>
              <li>
                <img src={school} alt="" />
                <p>{props.data ? props.data.profile.education : "Education"}</p>
              </li>
              <li>
                <img src={briefcase} alt="" />
                <p>{props.data ? props.data.profile.job : "Job"}</p>
              </li>
              <li>
                <img src={person} alt="" />
                <p>
                  {props.data ? `Age: ${props.data.profile.age} y.o.` : "Age"}
                </p>
              </li>
              <li>
                <img src={document} alt="" />
                <p>
                  {props.data ? props.data.profile.description : "Description"}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Button className="post-button">Leave chat</Button>
    </div>
  );
};

export default PostInfo;
