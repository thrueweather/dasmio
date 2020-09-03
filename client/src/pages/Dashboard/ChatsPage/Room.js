import React, { useState } from "react";

import { Query } from "react-apollo";

import PostInfo from "./PostInfo";
import MessageSender from "./MessageSender";
import AcceptRoom from "./AcceptRoom";
import gql from "graphql-tag";

import { MessagesContainer } from "./MessagesContainer";

import profileAvatar from "assets/profile-avatar.svg";

import { MESSAGE_PER_PAGE } from "constants/index";
import * as query from "api/queries";

const Room = (props) => {
  const MESSAGE_SUBSCRIPTION = gql`
    subscription newMessage($channelId: ID) {
      newMessage(channelId: $channelId) {
        id
        text
        sender {
          id
          name
          avatar {
            id
            image
          }
        }
        time
        seen
      }
    }
  `;

  const subscribeToNewMessage = (subscribeToMore, refetch) => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { channelId: +props.room.id },
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        if (subscriptionData.data && prev) {
          await refetch();
          return Object.assign({}, prev, {
            data: {
              room: {
                messages: [subscriptionData.data, ...prev.room.messages],
                ...prev.room,
              },
            },
          });
        }
      },
    });
  };

  return (
    <div className={"room"}>
      {props.room ? (
        <Query
          query={query.ROOM}
          variables={{
            id: props.room.id,
            firstUser: props.userId,
            secondUser: props.sender.id,
            first: MESSAGE_PER_PAGE,
          }}
        >
          {({ loading, error, data, subscribeToMore, refetch, fetchMore }) => {
            if (loading) return "Loading";
            if (error) return `Error! ${error.message}`;
            subscribeToNewMessage(subscribeToMore, refetch);
            return (
              <>
                <div className="room-container">
                  <div className="head">
                    <div className={"dialog-item"}>
                      <div className="dialog-item-avatar">
                        <img
                          src={
                            props.sender.avatar.image
                              ? `${process.env.REACT_APP_CONST_BACKEND}/media/${props.sender.avatar.image}`
                              : profileAvatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="dialog-item-info">
                        <h3>PostInfo</h3>
                        <p>Lorem ipsum dolor sit amet, co...</p>
                      </div>
                    </div>
                    <div>asd</div>
                  </div>
                  <MessagesContainer
                    room={data.room}
                    sender={props.sender}
                    fetchMore={fetchMore}
                  />

                  {data.room.waitingForApprove ? (
                    <AcceptRoom room={data.room} />
                  ) : (
                    <>
                      <MessageSender roomId={data.room.id} refetch={refetch} />
                    </>
                  )}
                </div>

                <PostInfo data={data.room.post} />
              </>
            );
          }}
        </Query>
      ) : (
        <>
          <div className="room-container">
            <div className="head">
              <div className={"dialog-item"}>
                <div className="dialog-item-avatar">
                  <img src={profileAvatar} alt="Sender avatar" />
                </div>
                <div className="dialog-item-info">
                  <h3>PostInfo</h3>
                  <p>Lorem ipsum dolor sit amet, co...</p>
                </div>
              </div>
              <div>asd</div>
            </div>

            <div className="messages"></div>
          </div>
          <PostInfo data={false} />
        </>
      )}
    </div>
  );
};

export default Room;
