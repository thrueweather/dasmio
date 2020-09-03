import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import _ from "underscore";
import { Mutation } from "react-apollo";

import Toolbar from "./Toolbar";
import Post from "./Post";
import Modal from "components/Modal";
import ErrorBoundary from "components/ErrorBoundary";
import NoPostsInCategory from "components/Placeholders/NoPostsInCategory";
import NoPostsInFavourites from "components/Placeholders/NoPostsInFavourites";

import { useDebounce } from "utils/hooks.js";
import { useInfiniteScroll } from "utils/hooks.js";

import * as query from "api/queries";
import * as mutate from "api/mutations/index";
import * as path from "constants/routes";
import { showAlert, loader } from "utils/index";

import { PER_PAGE, DELAY } from "constants/index";
import locationLogo from "assets/location.svg";
import { withUserProfile } from "hocs/withUserProfile";

import "./style.scss";

const modalStyles = {
  width: 410,
  height: 257,
  transform: "translate(-0%, -0%)",
  top: "7.5%",
  left: "2%",
};

const Listings = (props) => {
  const activeProfile = props.user.profiles.filter((prof) => prof.isActive)[0];
  const locationState = props.location.state;

  const [state, setState] = useState({
    categoryId: locationState ? locationState.category.id : 1,
    lookingFor: locationState
      ? locationState.lookingFor
      : activeProfile
      ? activeProfile.gender === "MALE"
        ? "Woman"
        : activeProfile.gender === "FEMALE"
        ? "Man"
        : "Not matter"
      : "Not matter",
    age: (locationState && locationState.age) || [18, 55],
    favorite: false,
    perPage: PER_PAGE,
    data: [],
    refresh: false,
    loading: false,
    errorModal: false,
    isScrolling: false,
    numObjects: null,
    sorry: false,
    addPost: false,
  });

  const [page, setPage] = useState(1);
  const [geoLocationMogal, toggleGeolocationModal] = useState(false);
  const [isFetching, setIsFetching] = useInfiniteScroll({
    delay: DELAY,
    callback: () => (!refresh ? handleChagePage() : null),
    skip: state.loading || state.data.length === state.numObjects,
  });

  useEffect(() => {
    if (
      props.location.pathname !== path.CREATE_PROFILE &&
      !props.user.geoLocationAllowed
    ) {
      toggleGeolocationModal(true);
    }
  }, [props.user]);

  useEffect(() => {
    if (!isFetching || state.data.length === state.numObjects) return;

    handleScroll();
  }, [page]);

  const debouncedAge = useDebounce(state.age, 300);

  const { categoryId, lookingFor, favorite, perPage, refresh } = state;

  const handleChagePage = () => setPage(page + 1);

  const handleScroll = async (refresh) => {
    try {
      setState({ ...state, loading: true, isScrolling: true });

      const response = await props.client.query({
        query: query.LISTING,
        variables: {
          categoryId: categoryId.value || categoryId,
          favorite,
          lookingFor,
          minAge: debouncedAge[0],
          maxAge: debouncedAge[1],
          perPage: refresh ? state.data.length : PER_PAGE,
          page: refresh ? 1 : page,
        },
        fetchPolicy: "no-cache",
      });
      const posts = response.data.listing.listing;
      const isEqual = await _.isEqual(state.data, posts);

      await setState({
        ...state,
        data:
          !isEqual && !refresh
            ? [...state.data, ...posts]
            : refresh
            ? posts
            : state.data,
        numObjects: response.data.listing.numObjects,
        loading: false,
        refresh: false,
        sorry: response.data.listing.sorry,
        addPost: response.data.listing.addPost,
      });
      setIsFetching(false);
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  useEffect(() => {
    fetchData(debouncedAge, categoryId, lookingFor, favorite, page);
  }, [debouncedAge, categoryId, lookingFor, favorite]);

  const fetchData = async (
    debouncedAge,
    categoryId,
    lookingFor,
    favorite,
    page
  ) => {
    setState({ ...state, loading: true, isScrolling: false });

    try {
      const response = await props.client.query({
        query: query.LISTING,
        variables: {
          categoryId: categoryId.value || categoryId,
          favorite,
          lookingFor,
          minAge: debouncedAge[0],
          maxAge: debouncedAge[1],
          perPage: PER_PAGE,
          page: page,
        },
        fetchPolicy: "no-cache",
      });

      setState({
        ...state,
        data: response.data.listing.listing || [],
        numObjects: response.data.listing.numObjects,
        loading: false,
        sorry: response.data.listing.sorry,
        addPost: response.data.listing.addPost,
        perPage,
      });
    } catch (error) {
      props.user.geoLocationAllowed && setState({ ...state, errorModal: true });
    }
  };

  const handleChangeSelection = (type) => (value) => {
    setPage(1);
    if (type === "age" && value[1] >= 21) {
      setState({
        ...state,
        [type]: value,
      });
      setPage(1);
    }
    if (type !== "age") {
      setState({
        ...state,
        [type]: value,
      });
      setPage(1);
    }
  };

  const handleRefreshListings = () => {
    setState({ ...state, refresh: true });
    handleScroll("refresh");
  };

  const handleAnswerOnPost = async (postId, values, toggleChatModal) => {
    try {
      const createRoom = await props.client.mutate({
        mutation: mutate.CREATE_ROOM,
        variables: {
          roomInput: {
            postId,
          },
        },
        fetchPolicy: "no-cache",
      });
      if (createRoom.data.createRoom.success) {
        const createMessage = await props.client.mutate({
          mutation: mutate.CREATE_MESSAGE,
          variables: {
            messageInput: {
              text: values.description,
              roomId: createRoom.data.createRoom.room.id,
            },
          },
          fetchPolicy: "no-cache",
        });
        if (createMessage.data.createMessage.success) {
          toggleChatModal(false);
          showAlert("Success!", "Your reply has been successfully sent");

          handleRefreshListings();
        }
      }
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  const getLocations = new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      resolve({ latitude, longitude });
    };

    const error = (err) => reject(`ERROR(${err.code}): ${err.message}`);

    navigator.geolocation.getCurrentPosition(success, error, options);
  });

  const handleAllowGelolocation = async (mutate) => {
    try {
      const getCoordinates = await getLocations;
      const response = await mutate({
        variables: {
          isAllowed: true,
          ...getCoordinates,
        },
        refetchQueries: [{ query: query.USER }],
      });
      if (response.data.allowGeoLocation.success) {
        toggleGeolocationModal(false);
        fetchData(debouncedAge, categoryId, lookingFor, favorite, page);
      }
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  const posts = (
    <>
      <div className="listings-content mb-3">
        {!_.isEmpty(state.data) &&
          state.data.map((post) => (
            <Post
              key={post.id}
              category={categoryId}
              gender={lookingFor}
              perPage={perPage}
              handleRefreshListings={handleRefreshListings}
              handleAnswerOnPost={handleAnswerOnPost}
              favorite={favorite}
              {...post}
            />
          ))}
      </div>
      <Button
        style={{ background: "#639BE6" }}
        className="d-block mx-auto mb-3 text-white px-5"
        onClick={handleRefreshListings}
        loading={state.loading}
      >
        Refresh
      </Button>
    </>
  );

  const sorry = <NoPostsInCategory category={categoryId} />;

  const favoriteComponent = <NoPostsInFavourites category={categoryId} />;

  const renderContent =
    !state.isScrolling && state.loading
      ? loader
      : state.sorry && !favorite
      ? sorry
      : _.isEmpty(state.data) && favorite
      ? favoriteComponent
      : posts;

  return (
    <div className="listings-list">
      <Toolbar
        handleChangeSelection={handleChangeSelection}
        activeProfile={activeProfile}
        {...state}
      />
      {renderContent}
      <Modal
        isOpen={geoLocationMogal}
        toggleModal={() => null}
        customStyles={modalStyles}
        content={
          <div className="geolocation-modal">
            <img src={locationLogo} alt="" />
            <h3>Geolocation</h3>
            <p>
              Dasmio uses geolocation to find people near you. No geolocation -
              no communication!
            </p>
            <Mutation mutation={mutate.allowGeoLocation}>
              {(allowGeoLocation, { data, loading }) => (
                <Button
                  className="primary-button"
                  style={{ background: "#6EA7F4" }}
                  onClick={() => handleAllowGelolocation(allowGeoLocation)}
                  loading={loading}
                >
                  Agree
                </Button>
              )}
            </Mutation>
          </div>
        }
      />
      <ErrorBoundary
        isOpen={state.errorModal}
        toggleModal={() => setState({ ...state, errorModal: false })}
        submit={handleRefreshListings}
      />
    </div>
  );
};

export default withUserProfile(Listings);
