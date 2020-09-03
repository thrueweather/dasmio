import React, { useState } from "react";

import { Query } from "react-apollo";

import ChatPage from "./ChatsPage";

import * as query from "api/queries";
import { withUserProfile } from "hocs/withUserProfile";

import "./style.scss";

const ListingsRoom = ({ user, location, categoryId, setCategoryId }) => {
  return (
    <Query query={query.LISTING_ROOMS}>
      {({ loading, error, data }) => {
        if (loading) return "Loading";
        if (error) return `Error! ${error.message}`;
        return <h1>ListingsRooms</h1>;
        // return (
        //   <ChatPage
        //     userId={user.id}
        //     profiles={user.profiles}
        //     rooms={data.rooms}
        //     room={location.state ? location.state.room : data.rooms[0]}
        //     categoryId={categoryId}
        //     setCategoryId={setCategoryId}
        //   />
        // );
      }}
    </Query>
  );
};

const MatchesRoom = ({ user, location, categoryId, setCategoryId }) => {
  return (
    <Query query={query.MATCHES_ROOMS}>
      {({ loading, error, data }) => {
        if (loading) return "Loading";
        if (error) return `Error! ${error.message}`;
        // return <h1>MatchesRooms</h1>;

        return (
          <ChatPage
            userId={user.id}
            profiles={user.profiles}
            rooms={data.matchesRooms}
            room={location.state ? location.state.room : data.matchesRooms[0]}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        );
      }}
    </Query>
  );
};

const Messages = ({ user, location, categoryId, setCategoryId }) => {
  return (
    <Query query={query.ROOMS} variables={{ userId: user.profiles[0].id }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading";
        if (error) return `Error! ${error.message}`;
        return (
          <ChatPage
            userId={user.id}
            profiles={user.profiles}
            rooms={data.rooms}
            room={location.state ? location.state.room : data.rooms[0]}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        );
      }}
    </Query>
  );
};

const ChatsPage = (props) => {
  const [categoryId, setCategoryId] = useState(2);
  console.log(categoryId);
  const category = [
    <MatchesRoom
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      {...props}
    />,
    <ListingsRoom
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      {...props}
    />,

    <Messages
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      {...props}
    />,
  ];
  return <>{category[categoryId]}</>;
};

export default withUserProfile(ChatsPage);
