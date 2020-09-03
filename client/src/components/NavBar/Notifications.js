import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useClickOutside } from "utils/hooks.js";

import notificationIcon from "assets/notifications.svg";
import * as query from "api/queries";

const NotificationsContainer = (props) => {
  const [isOpen, toggleMenu] = useState(false);
  const innerRef = useRef();

  useClickOutside(innerRef, () => toggleMenu(false));

  const NOTIFICATIONS_SUBSCRIPTION = gql`
    subscription notifications($profileId: Int) {
      notifications(profileId: $profileId) {
        id
        notificationText
        actionType
      }
    }
  `;
  const profile = props.user.profiles.find((profile) => profile.isActive);

  const subscribeToNewMessage = (subscribeToMore, refetch) => {
    subscribeToMore({
      document: NOTIFICATIONS_SUBSCRIPTION,
      variables: {
        profileId: profile.id,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        if (
          subscriptionData.data &&
          subscriptionData.data.notifications &&
          prev
        ) {
          refetch();
          return Object.assign({}, prev, {
            data: {
              notifications: [
                subscriptionData.data.notifications,
                ...prev.notifications,
              ],
            },
          });
        }
      },
    });
  };

  return (
    <Query query={query.NOTIFICATIONS} variables={{ profileId: profile.id }}>
      {({ loading, error, data, subscribeToMore, refetch }) => {
        if (loading) return null;
        if (error) return `Error! ${error.message}`;
        subscribeToNewMessage(subscribeToMore, refetch);

        return (
          <div className="position-relative">
            <div className="position-relative">
              <img
                src={notificationIcon}
                onClick={() => toggleMenu(true)}
                className="pointer"
                alt=""
              />
              {data.notifications.length ? <span className="badge" /> : null}
            </div>
            {isOpen && (
              <div className="notifications-menu" ref={innerRef}>
                {data.notifications.length ? (
                  data.notifications.reverse().map((notification) => {
                    return (
                      <div
                        className="notifications-wrapp"
                        key={notification.id}
                      >
                        <p>{notification.notificationText}</p>
                        <Link to="/">See more</Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="notifications-wrapp">
                    <p>there are no notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

export default NotificationsContainer;
