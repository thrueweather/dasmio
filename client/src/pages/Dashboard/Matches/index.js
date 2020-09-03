import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "underscore";

import Toolbar from "./Toolbar";
import Post from "../Listings/Post";
import NoMatches from "../Matches/NoMatches";
import MatchModal from "./MatchModal";
import ErrorBoundary from "components/ErrorBoundary";
import AddPost from "components/Placeholders/AddPost";

import * as query from "api/queries";
import * as mutate from "api/mutations/index";
import * as path from "constants/routes";
import { useInfiniteScroll } from "utils/hooks.js";

import { PER_PAGE, DELAY } from "constants/index";
import { withUserProfile } from "hocs/withUserProfile";
import { showAlert, loader } from "utils/index";

import "../Listings/style.scss";

const Matches = (props) => {
  const [state, setState] = useState({
    categoryId: props.location.state,
    likedMe: false,
    perPage: PER_PAGE,
    data: [],
    refresh: false,
    loading: false,
    isScrolling: false,
    errorModal: false,
    numObjects: null,
    hasPosts: false,
    sorry: false,
    addPost: false,
  });

  const [page, setPage] = useState(1);
  const [hasPostsInCategory, toggleHasPosts] = useState(false);
  const [matchModal, toggleMatchModal] = useState({
    isOpen: false,
    data: null,
    room: null,
  });

  const {
    data,
    categoryId,
    likedMe,
    perPage,
    refresh,
    numObjects,
    loading,
  } = state;

  const [isFetching, setIsFetching] = useInfiniteScroll({
    delay: DELAY,
    callback: () => (!refresh ? handleChagePage() : null),
    skip: loading || data.length === numObjects,
  });

  useEffect(() => {
    if (categoryId) {
      fetchData(categoryId, likedMe);
    }
  }, [categoryId, likedMe]);

  useEffect(() => {
    if (!isFetching || data.length === numObjects) return;

    handleScroll();
  }, [page]);

  const handleChagePage = () => data.length !== numObjects && setPage(page + 1);

  const handleScroll = async (refresh) => {
    try {
      setState({ ...state, loading: true, isScrolling: true });

      const response = await props.client.query({
        query: query.MATCHES,
        variables: {
          postId:
            (typeof categoryId === "object" && categoryId.id) || categoryId,
          likedMe,
          perPage: refresh ? state.data.length : PER_PAGE,
          page: refresh ? 1 : page,
        },
        fetchPolicy: "no-cache",
      });

      const posts = response.data.matches.listing;
      const isEqual = await _.isEqual(state.data, posts);

      await setState({
        ...state,
        data:
          !isEqual && !refresh
            ? [...state.data, ...posts]
            : refresh
            ? posts
            : state.data,
        numObjects: response.data.matches.numObjects,
        hasPosts: response.data.matches.hasPosts,
        sorry: response.data.matches.sorry,
        addPost: response.data.matches.addPost,
        loading: false,
        refresh: false,
      });

      setIsFetching(false);
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  const fetchData = async (categoryId, likedMe) => {
    setState({ ...state, loading: true, isScrolling: false });

    try {
      const response = await props.client.query({
        query: query.MATCHES,
        variables: {
          postId:
            (typeof categoryId === "object" && categoryId.id) || categoryId,
          likedMe,
          perPage,
          page,
        },
        fetchPolicy: "no-cache",
      });

      setState({
        ...state,
        data: response.data.matches.listing || [],
        numObjects: response.data.matches.numObjects,
        hasPosts: response.data.matches.hasPosts,
        sorry: response.data.matches.sorry,
        addPost: response.data.matches.addPost,
        loading: false,
        refresh: false,
      });
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  const handleChangeSelection = (type) => (value) => {
    if (type === "likedMe") setPage(1);

    setState({
      ...state,
      [type]: value,
    });
  };

  const handleRefreshListings = () => {
    setState({ ...state, refresh: true });
    handleScroll("refresh");
  };

  const handleAnswerOnPost = async (postId, values, toggleChatModal) => {
    try {
      const response = await props.client.mutate({
        mutation: mutate.SUPER_LIKE_POST,
        variables: {
          text: values.description,
          postId,
        },
        fetchPolicy: "no-cache",
      });
      if (response.data.superLikePost.success) {
        toggleChatModal(false);
        showAlert("Success!", "Your SuperLike has been successfully sent");
      }
    } catch (error) {
      setState({ ...state, errorModal: true });
    }
  };

  const handleSetCategory = (category) =>
    setState({ ...state, categoryId: category });

  const activeProfile = props.user.profiles.filter(
    (profile) => profile.isActive
  );

  const sorry = (
    <NoMatches
      title="Sorry!"
      category={categoryId && categoryId.text}
      subtitle={
        <p>
          At the moment there are no posts in the{" "}
          <strong>{state.categoryId && state.categoryId.category.name}</strong>{" "}
          category and relevant to your post,
          <br /> come back a little later and they will appear or set a
          notification.
        </p>
      }
    >
      <Checkbox
        label={
          <>
            <label>
              Receive notification of new posts in{" "}
              <strong>
                {state.categoryId && state.categoryId.category.name}{" "}
              </strong>
              category (You can configure alerts{" "}
              <Link to={path.NOTIFICATIONS}>here</Link>)
            </label>
          </>
        }
      />
    </NoMatches>
  );

  const nobodyLiked = (
    <NoMatches
      title="Sorry!"
      subtitle={
        <p>
          Nobody has liked you yet. Continue to browse the posts <br /> and
          someone will like you.
        </p>
      }
    />
  );

  const posts = (
    <>
      <div className="listings-content mb-3">
        {!_.isEmpty(data) &&
          data.map((post) => (
            <Post
              key={post.id}
              category={categoryId}
              perPage={perPage}
              handleRefreshListings={handleRefreshListings}
              handleAnswerOnPost={handleAnswerOnPost}
              favorite={likedMe}
              matchModal={state.matchModa}
              toggleMatchModal={(userData, room) =>
                toggleMatchModal({
                  isOpen: true,
                  data: userData,
                  room,
                })
              }
              type="matches"
              {...post}
            />
          ))}
      </div>
      {!_.isEmpty(data) && (
        <Button
          style={{ background: "#639BE6" }}
          className="d-block mx-auto mb-3 text-white px-5"
          onClick={handleRefreshListings}
          loading={loading}
        >
          Refresh
        </Button>
      )}
    </>
  );

  const renderContent =
    !state.isScrolling && state.loading ? (
      loader
    ) : props.user.addMatchPost && !likedMe ? (
      <AddPost category={categoryId} />
    ) : state.sorry && !likedMe ? (
      sorry
    ) : !state.hasPosts && likedMe ? (
      nobodyLiked
    ) : (
      posts
    );

  return (
    <div className="listings-list">
      <Toolbar
        handleChangeSelection={handleChangeSelection}
        activeProfile={activeProfile}
        likedMe={likedMe}
        toggleHasPosts={toggleHasPosts}
        isMatched={hasPostsInCategory}
        selectedCategory={categoryId && categoryId.category.id}
        handleSetCategory={handleSetCategory}
        {...props}
        {...state}
      />
      {renderContent}
      <MatchModal
        isOpen={matchModal.isOpen}
        activeProfile={activeProfile}
        toggleModal={() => toggleMatchModal({ ...matchModal, isOpen: false })}
        refresh={() => handleScroll("refresh")}
        user={matchModal.data}
        room={matchModal.room}
      />
      <ErrorBoundary
        isOpen={state.errorModal}
        toggleModal={() => setState({ ...state, errorModal: false })}
        submit={handleRefreshListings}
      />
    </div>
  );
};

export default withUserProfile(Matches);
