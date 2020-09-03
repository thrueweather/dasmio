import React, { useState, useEffect, Fragment } from "react";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";

import { Image, Button, Loader } from "semantic-ui-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _ from "underscore";
import Lightbox from "react-image-lightbox";
import { Carousel } from "react-responsive-carousel";
import IosChatbubblesOutline from "react-ionicons/lib/IosChatbubblesOutline";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import Modal from "components/Modal";
import { CustomTextArea } from "components/Forms/CustomTextArea";

import location from "assets/location-outline.svg";
import handLeft from "assets/hand-left-outline.svg";
import star from "assets/star.svg";
import starLine from "assets/star-line.svg";
import roundMail from "assets/round-mail.svg";
import like2 from "assets/like2.svg";
import like from "assets/like.svg";
import superLike from "assets/superLike.svg";
import trashIcon from "assets/trash.svg";
import playIcon from "assets/play.svg";
import edit from "assets/edit.svg";
import stop from "assets/stop.svg";
import removeIcon from "assets/remove-icon.svg";
import blueCloseIcon from "assets/blue-close-icon.svg";

import * as mutate from "api/mutations/index";
import { POST_MAX_LENGTH, TIME_DURATION } from "constants/index";
import * as path from "constants/routes";

import { showAlert, withPromise, getMilliseconds } from "utils/index";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-image-lightbox/style.css";
import "react-circular-progressbar/dist/styles.css";

const Listing = (props) => {
  const [showText, toggleShowText] = useState(false);
  const [chatModal, toggleChatModal] = useState(false);
  const [expandedImage, toggleExpandedImage] = useState({
    selectedPhoto: null,
    photoModal: false,
    mode: null,
  });
  const [photoIndex, setPhotoIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [inProgress, toggleProgress] = useState(false);

  useEffect(() => {
    if (props.managePosts) {
      if (percentage === 0) return;

      const timer = setTimeout(() => {
        alert("Success");
        setPercentage(0);
        toggleProgress(false);
      }, TIME_DURATION);

      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const handleSetTime = async () => {
    await withPromise(toggleProgress(true));

    setPercentage(100);
  };

  const stopTimer = () => {
    toggleProgress(false);
    setPercentage(0);
  };

  const handleAddFavoritePost = async (mutate, matches, type) => {
    if (matches) return toggleChatModal(true);
    try {
      const response = await mutate({
        variables: { postId: props.id },
      });

      if (type === "addFavoritePost") {
        showAlert("Success!", "Post has been successfully added to favorites");
        props.handleRefreshListings();
      } else if (type === "removeFromFavorite") {
        showAlert(
          "Success!",
          "Post has been successfully deleted from favorites"
        );
        props.handleRefreshListings();
      } else {
        if (response.data.likePost.redirect) {
          showAlert("Success!", "Your SuperLike has been successfully sent");
          props.toggleMatchModal(props.profile, response.data.likePost.room);
        } else {
          props.handleRefreshListings();
        }
      }
    } catch (error) {}
  };

  const handleDislikePost = async (mutate) => {
    try {
      const response = await mutate({
        variables: { postId: props.id },
      });

      if (response.data.dislikePost.success) {
        showAlert("Success!", "Post has been hidden");
        props.handleRefreshListings();
      }
    } catch (error) {}
  };

  const cardHeader = (
    <div className="post-header">
      <div>
        <Image
          src={`${process.env.REACT_APP_CONST_BACKEND}/media/${props.profile.avatar.image}`}
          className="pointer"
          onClick={() => handleSetPhoto(props.profile.avatar, "photo")}
          avatar
        />
        <span>{props.profile.name}</span>
      </div>
      <div className="d-flex align-items-center">
        <div>
          <span style={{ lineHeight: "14px" }}>
            {props.distance > 0 ? props.distance.toFixed(1) : props.distance} km
          </span>
          <img src={location} alt="" className="location-icon" />
        </div>
      </div>
    </div>
  );

  const renderText = (
    <div className="listings-text">
      {!showText ? (
        props.text.length >= POST_MAX_LENGTH ? (
          <>
            {props.text.slice(0, POST_MAX_LENGTH).concat("...")}{" "}
            <div
              className="link d-inline"
              onClick={() => toggleShowText(!showText ? true : false)}
            >
              {!showText ? "more" : "less"}
            </div>
          </>
        ) : (
          props.text
        )
      ) : (
        <>
          {props.text}{" "}
          <div
            className="link d-inline"
            onClick={() => toggleShowText(!showText ? true : false)}
          >
            {!showText ? "more" : "less"}
          </div>
        </>
      )}
    </div>
  );

  const dislikeAction = (
    <div className="icon">
      <Mutation mutation={mutate.DISLIKE_POST}>
        {(dislikePost, { data, loading }) =>
          !data && loading ? (
            <Loader active inline />
          ) : (
            <img
              src={handLeft}
              onClick={() => handleDislikePost(dislikePost)}
              alt=""
            />
          )
        }
      </Mutation>
    </div>
  );

  const likeAction = (
    <Modal
      isOpen={chatModal}
      toggleModal={() => toggleChatModal(false)}
      customStyles={{
        width: 502,
        minHeight: 608,
      }}
      trigger={
        props.type ? (
          <Mutation mutation={mutate.LIKE_POST}>
            {(addFavoritePost, { data, loading }) => (
              <div
                className="icon chat-icon"
                onClick={() => handleAddFavoritePost(addFavoritePost)}
              >
                {!data && loading ? (
                  <Loader active inline />
                ) : (
                  <img src={like} alt="" />
                )}
              </div>
            )}
          </Mutation>
        ) : (
          <div
            className="icon chat-icon"
            style={props.hasRoom ? { opacity: 0.5, cursor: "auto" } : null}
            onClick={() => (!props.hasRoom ? toggleChatModal(true) : null)}
          >
            {!props.type ? (
              <IosChatbubblesOutline fontSize="34px" color="#6EA7F4" />
            ) : (
              <img src={like} alt="" />
            )}
          </div>
        )
      }
      content={
        <div className="chat-modal">
          <div className="text-center">
            <div
              className="d-flex justify-content-center"
              style={{ width: 130, margin: "15px auto" }}
            >
              <img src={!props.type ? roundMail : superLike} alt="" />
              <img
                src={!props.type ? roundMail : superLike}
                alt=""
                style={{ margin: `0  ${!props.type ? "15px" : 0}` }}
              />
              <img src={!props.type ? roundMail : superLike} alt="" />
            </div>
            <h2>
              {!props.type ? "It's your response!" : "Wow, it`s superlike!"}
            </h2>
          </div>
          {cardHeader}
          <h4>Post text</h4>
          <p>{props.text}</p>
          <h4>Your message for {props.profile.name}</h4>
          <Formik
            initialValues={{
              description: "",
            }}
            validationSchema={Yup.object().shape({
              description: Yup.string().required("Message is required"),
            })}
            onSubmit={(form) =>
              props.handleAnswerOnPost(props.id, form, toggleChatModal)
            }
          >
            {({ values }) => (
              <Form>
                <Field
                  name="description"
                  type="text"
                  component={CustomTextArea}
                  placeholder="Got something you want to talk about?"
                  value={values.description}
                  rows="8"
                  maxLength={500}
                />
                <div className="d-flex text-center mt-4">
                  <Button
                    type="button"
                    className="secondary-button blue-outl w-50 mr-2"
                    onClick={() => toggleChatModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="primary-button blue-btn w-50 ml-2"
                  >
                    Reply post
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );

  const favoriteAction = (
    <Mutation
      mutation={
        !props.favorite ? mutate.ADD_FAVORITE_POST : mutate.REMOVE_FAVORITE_POST
      }
    >
      {(addFavoritePost, { data, loading }) => (
        <div
          className="icon"
          onClick={() =>
            handleAddFavoritePost(
              addFavoritePost,
              props.type,
              !props.favorite ? "addFavoritePost" : "removeFromFavorite"
            )
          }
        >
          {!data && loading ? (
            <Loader active inline />
          ) : (
            <img
              src={!props.type ? (!props.favorite ? star : starLine) : like2}
              alt=""
            />
          )}
        </div>
      )}
    </Mutation>
  );

  const handleSetPhoto = (photo, mode) => {
    toggleExpandedImage({
      selectedPhoto: photo,
      photoModal: true,
      mode,
    });
  };

  const images = _.isArray(expandedImage.selectedPhoto)
    ? expandedImage.selectedPhoto.map((image) => ({
        ...image,
        image: `${process.env.REACT_APP_CONST_BACKEND}/media/${
          image.source && image.source.image
        }`,
      }))[photoIndex].image
    : expandedImage.selectedPhoto &&
      `${process.env.REACT_APP_CONST_BACKEND}/media/${
        expandedImage.selectedPhoto.source &&
        expandedImage.selectedPhoto.source.image
      }`;

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

  const actions = [
    <div className="action-icon">
      <img src={trashIcon} alt="" />
    </div>,
    !inProgress ? (
      <div className="action-icon play" onClick={handleSetTime}>
        <img src={playIcon} alt="" />
      </div>
    ) : (
      // <div className="action-icon stop" onClick={handleSetTime}>
      //   <img src={stop} alt="" />
      // </div>
      <div
        style={{ width: 64, height: 64, margin: "0 30px" }}
        className="pointer"
        onClick={stopTimer}
      >
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            rotation: 0,
            pathTransitionDuration: getMilliseconds(TIME_DURATION),
            pathColor: "rgba(110, 167, 244, 1)", // `rgba(243, 116, 116, 1)`,
            trailColor: "rgba(110, 167, 244, 0.2)", //  "rgba(243, 116, 116, 0.2)",
            backgroundColor: "red", // "rgba(243, 116, 116, 0.2)",
          })}
        >
          <img src={blueCloseIcon} alt="" />
        </CircularProgressbarWithChildren>
      </div>
    ),
    <Link
      to={{
        pathname: path.EDIT_POST,
        state: {
          ...props,
          age: [props.minAge, props.maxAge],
        },
      }}
    >
      {" "}
      <div className="action-icon">
        <img src={edit} alt="" />
      </div>
    </Link>,
  ];

  return (
    <div className="listings-post">
      {cardHeader}
      <div className="listings-carousel">
        {props.photos.length > 1 ? (
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            selectedItem={photoIndex}
            onChange={(i) => setPhotoIndex(i)}
          >
            {props.photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handleSetPhoto(props.photos, "slider")}
              >
                <img
                  className="w-100 pointer cover"
                  src={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          props.photos.map((photo) => (
            <div key={photo.id} onClick={() => handleSetPhoto(photo, "photo")}>
              <img
                className="w-100 pointer cover"
                src={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
              />
            </div>
          ))
        )}
      </div>
      {renderText}
      <div className="listings-action">
        {(props.managePosts &&
          actions.map((action, index) => (
            <Fragment key={index}>{action}</Fragment>
          ))) || (
          <>
            {dislikeAction}
            {likeAction}
            {favoriteAction}
          </>
        )}
      </div>

      {expandedImage.photoModal && (
        <Lightbox
          mainSrc={images}
          imageLoadErrorMessage={imageLoading}
          nextSrc={
            expandedImage.selectedPhoto[
              (photoIndex + 1) % expandedImage.selectedPhoto.length
            ]
          }
          prevSrc={
            expandedImage.selectedPhoto[
              (photoIndex + expandedImage.selectedPhoto.length - 1) %
                expandedImage.selectedPhoto.length
            ]
          }
          onCloseRequest={() =>
            toggleExpandedImage({ ...expandedImage, photoModal: false })
          }
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + expandedImage.selectedPhoto.length - 1) %
                expandedImage.selectedPhoto.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % expandedImage.selectedPhoto.length)
          }
          enableZoom={false}
          imageCaption={
            <h3 className="text-center">
              Photo {photoIndex + 1} of{" "}
              {expandedImage.selectedPhoto.length || 1}
            </h3>
          }
        />
      )}
    </div>
  );
};

export default Listing;
