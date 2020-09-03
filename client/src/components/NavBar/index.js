import React, { useState } from "react";
import { Link } from "react-router-dom";

import Menu from "./Menu";
import Notifications from "./Notifications";

import * as path from "constants/routes";
import * as query from "api/queries";

import logo from "assets/logo.svg";
import document from "assets/document-text-outline.svg";
import heart from "assets/heart.svg";
import settings from "assets/settings.svg";
import chat from "assets/chat.svg";

import "./styles.scss";

const routes = [
  { id: 1, path: path.LISTINGS, icon: document, label: "Listings" },
  { id: 2, path: path.MATCHES, icon: heart, label: "Matches" },
  { id: 3, path: path.SETTINGS, icon: settings, label: "Settings" },
  { id: 4, path: path.MESSAGES, icon: chat, label: "Messages" },
];

const NavBar = (props) => {
  const [select, toggleSelect] = useState(false);

  const { user, location, history, client } = props;

  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    client.cache.reset();
    history.push(path.SIGN_IN);
  };

  const handelSetActiveProfile = async (mutate, profileId) => {
    try {
      const response = await mutate({
        variables: { profileId },
        refetchQueries: [{ query: query.USER, fetchPolicy: "no-cache" }],
      });
      if (response.data.setActiveProfile.success) {
        window.location.reload();
        if (!user.profiles.length) {
          history.push(path.CREATE_PROFILE);
        }
      }
    } catch (error) {}
  };

  const isAgree =
    user.isVerified && user.geoLocationAllowed && user.profiles.length >= 1;

  return (
    <div className="header text-white">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="links">
          {isAgree &&
            routes.map((route) => (
              <Link
                key={route.id}
                className={`px-3 ${
                  `/${location.pathname.split("/")[1]}` === route.path
                    ? "active"
                    : ""
                }`}
                to={route.path}
              >
                <img src={route.icon} className="mr-2" />
                {route.label}
              </Link>
            ))}
        </div>
        {isAgree && (
          <div className="d-flex">
            <Notifications {...props} />
            <Menu
              select={select}
              user={user}
              handleLogOut={handleLogOut}
              toggleSelect={toggleSelect}
              handelSetActiveProfile={handelSetActiveProfile}
              {...props}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
