import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withApollo } from "react-apollo";

import Toolbar from "./Toolbar";
import AddPost from "components/Placeholders/AddPost";
import Post from "../../Listings/Post";

import { useInfiniteScroll } from "utils/hooks.js";

import * as query from "api/queries";
import * as path from "constants/routes";
import { PER_PAGE, DELAY } from "constants/index";
import { loader } from "utils/index";

import "../../Listings/style.scss";
import "react-circular-progressbar/dist/styles.css";

const Listings = (props) => {
  const [data, setData] = useState({
    posts: [],
    loading: true,
    isScrolling: false,
    numObjects: 0,
  });
  const [filters, setFilters] = useState({ category: 1, status: "All" });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useInfiniteScroll({
    delay: DELAY,
    callback: () => handleChagePage(),
    skip: data.loading || data.posts.length === data.numObjects,
  });

  useEffect(() => {
    props.setActiveLink(props.location.pathname);
    handleScroll("refresh");
  }, [filters]);

  useEffect(() => {
    if (!isFetching || data.posts.length === data.numObjects) return;

    handleScroll();
  }, [page]);

  const handleScroll = async (refresh) => {
    try {
      setData({ ...data, loading: true, isScrolling: refresh ? false : true });

      const response = await props.client.query({
        query: query.SETTINGS_LISTING,
        variables: {
          categoryId: filters.category,
          status: filters.status,
          perPage: PER_PAGE,
          page: page,
        },
        fetchPolicy: "no-cache",
      });
      const posts = response.data.settingsListing.listing;

      setData({
        posts: refresh ? posts : [...data.posts, ...posts],
        numObjects: response.data.settingsListing.numObjects,
        isScrolling: false,
        loading: false,
      });
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChagePage = () =>
    data.posts.length !== data.numObjects && setPage(page + 1);

  const handleChangeSelection = (type) => (value) => {
    setPage(1);
    setFilters({ ...filters, [type]: value });
  };

  return (
    <div>
      <Toolbar
        handleChangeSelection={handleChangeSelection}
        filters={filters}
      />
      {!data.isScrolling && data.loading ? (
        loader
      ) : data.posts.length === 0 ? (
        <AddPost
          subtitle={
            <p>
              You have to{" "}
              <span style={{ color: "#6ea7f4" }}>
                <Link to={{ pathname: path.CREATE_NEW_POST }}>add</Link>
              </span>{" "}
              post first and maange it here
            </p>
          }
        />
      ) : (
        <div className="listings-list">
          <div className="listings-content mb-3">
            {data.posts.map((post) => (
              <Post key={post.id} {...post} managePosts />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default withApollo(Listings);
