import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import PageNotFound from "pages/PageNotFound";

import * as path from "constants/routes";

import { useActiveLink } from "utils/hooks.js";
import { withUserProfile } from "hocs/withUserProfile";

import "./styles.scss";

const Listings = lazy(() => import("./Listings"));
const Matches = lazy(() => import("./Matches"));
const Profiles = lazy(() => import("./Profiles"));
const Notifications = lazy(() => import("./Notifications"));
const Account = lazy(() => import("./Account"));
const Legal = lazy(() => import("./Legal"));

const Settings = (props) => {
  const [activeLink, setActiveLink] = useActiveLink(props.location.pathname);

  const routes = [
    {
      id: 1,
      path: path.SETTINGS,
      name: "Listings",
    },
    {
      id: 2,
      path: path.SETTINGS_MATCHES,
      name: "Matches",
    },
    {
      id: 3,
      path: path.SETTINGS_PROFILES,
      name: "Profiles",
    },
    {
      id: 4,
      path: path.SETTINGS_NOTIFICATIONS,
      name: "Notifications",
    },
    {
      id: 5,
      path: path.SETTINGS_ACCOUNT,
      name: "Account",
    },
    {
      id: 6,
      path: path.SETTINGS_LEGAL,
      name: "Legal",
    },
  ];

  return (
    <div className="settings">
      <div className="navigation">
        {routes.map((route) => (
          <Link
            key={route.id}
            className={`px-3 ${activeLink === route.path ? "active" : ""}`}
            to={route.path}
          >
            {route.name}
          </Link>
        ))}
      </div>
      <Suspense fallback={null}>
        <div className="wrapp">
          <Switch>
            <Route
              exact
              path={path.SETTINGS}
              render={(props) => (
                <Listings
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route
              exact
              path={path.SETTINGS_MATCHES}
              render={(props) => (
                <Matches
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route
              exact
              path={path.SETTINGS_PROFILES}
              render={(props) => (
                <Profiles
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route
              exact
              path={path.SETTINGS_NOTIFICATIONS}
              render={(props) => (
                <Notifications
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route
              exact
              path={path.SETTINGS_ACCOUNT}
              render={(props) => (
                <Account
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route
              exact
              path={path.SETTINGS_LEGAL}
              render={(props) => (
                <Legal
                  {...props}
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                />
              )}
            />
            <Route render={() => <PageNotFound />} />
          </Switch>
        </div>
      </Suspense>
    </div>
  );
};

export default withUserProfile(Settings);
