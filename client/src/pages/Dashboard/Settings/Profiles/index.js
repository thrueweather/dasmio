import React, { useEffect } from "react";
import { withApollo } from "react-apollo";
import Spinner from "react-spinkit";

import Skeleton from "./Skeleton";
import Profile from "./Profile";

import { useQuery } from "utils/hooks.js";
import * as query from "api/queries";
import { MAX_PROFILES_COUNT } from "constants/index";
import * as path from "constants/routes";

import addProfile from "assets/profile-plus.svg";

import "./styles.scss";

const Profiles = (props) => {
  const { getData, loading, error, data } = useQuery({
    client: props.client,
    endpoint: query.USER,
    entity: "me",
    router: props.history,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    props.setActiveLink(props.location.pathname);
    fetchData();
  }, []);

  const fetchData = async () => await getData();

  if (loading || !data)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 600 }}
      >
        <Spinner name="cube-grid" color="black" noFadeIn />
      </div>
    );

  if (error) return `Error! ${error.message}`;

  return (
    <div className="profiles">
      {data.profiles.map((profile) => (
        <Profile key={profile.id} {...profile} />
      ))}
      {data.profiles.length !== MAX_PROFILES_COUNT && (
        <div className="add-new-profile">
          <img
            src={addProfile}
            onClick={() => props.history.push(path.CREATE_PROFILE)}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default withApollo(Profiles);
