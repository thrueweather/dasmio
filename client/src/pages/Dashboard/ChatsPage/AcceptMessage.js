import React from "react";

import RedHeart from "../../../assets/red_heart.svg"
import RedInfinity from "../../../assets/red-infinity.svg"

const AcceptMessage = ({ sender, post, receiverPost }) => {
  return (
    <div className={"accept-message"}>
      <div className={"text"}>
        <h3>It`s a Match!</h3>
        <p>
          You and {post.profile.name} like each other. Why not make the first
          move?
        </p>
      </div>
      <div className={"posts"}>
        <div className="message-post">
          <div className="dialog-item-avatar">
            <img
              src={`${process.env.REACT_APP_CONST_BACKEND}/media/${post.profile.avatar.image}`}
              alt=""
            />
            <span>{sender.name}</span>
          </div>
          <div className="post-image">
            <img
              src={`${process.env.REACT_APP_CONST_BACKEND}/media/${post.photos[0].image}`}
              alt=""
            />
          </div>
          <div className="post-description">
            <p>{post.text}</p>
          </div>
        </div>
        <div className="heart-image">
          <img src={RedHeart} alt="" />
          <img src={RedInfinity} alt="" />
        </div>
        <div className="message-post">
          <div className="dialog-item-avatar">
            <img
              src={receiverPost ? `${
                process.env.REACT_APP_CONST_BACKEND
              }/media/${receiverPost && receiverPost.profile.avatar.image}` : ""}
              alt=""
            />
            <span>{post.profile.name}</span>
          </div>
          <div className="post-image">
            <img
              src={receiverPost ? `${
                process.env.REACT_APP_CONST_BACKEND
              }/media/${receiverPost.photos[0].image}` : ""}
              alt=""
            />
          </div>
          <div className="post-description">
            <p>{receiverPost ? receiverPost.text : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptMessage;
