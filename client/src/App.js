import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import AuthSystemWrapp from "./pages/AuthSystem/index";
import SignUp from "./pages/AuthSystem/SignUp";
import SignIn from "./pages/AuthSystem/SignIn";
import ForgotPassword from "./pages/AuthSystem/ForgotPassword";
import Success from "./pages/AuthSystem/Success";
import Verification from "./pages/AuthSystem/Verification";
import ContactUs from "./pages/AuthSystem/ContactUs";
import CheckMailBox from "./pages/AuthSystem/CheckMailBox";
import ChangePassword from "./pages/AuthSystem/ChangePassword";
import PrivacyPolicy from "./pages/Support/PrivacyPolicy";
import CookiePolicy from "./pages/Support/CookiePolicy";
import TermsAndConditions from "./pages/Support/TermsAndConditions";
import Faq from "./pages/Support/Faq";
import MainWrapp from "./pages/Dashboard/index";
import PageNotFound from "./pages/PageNotFound";
import ServerError from "./pages/ServerError";

import * as path from "./constants/routes";

const CreateProfile = lazy(() => import("./pages/Dashboard/Profile/Create"));
const Listings = lazy(() => import("./pages/Dashboard/Listings"));
const NewPost = lazy(() => import("./pages/Dashboard/NewPost"));
const Matches = lazy(() => import("./pages/Dashboard/Matches"));
const NoMatches = lazy(() => import("./pages/Dashboard/Matches/NoMatches"));
const ChatsPage = lazy(() => import("./pages/Dashboard/ChatsPage"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));

export default () => {
  const APP_ROUTES = {
    staticRoutes: [
      { id: "1", path: "/", component: AuthSystemWrapp },
      { id: "2", path: path.SIGN_UP, component: SignUp },
      { id: "3", path: path.SIGN_IN, component: SignIn },
      { id: "4", path: path.FORGOT_PASSWORD, component: ForgotPassword },
      { id: "5", path: path.SUCCESS, component: Success },
      { id: "6", path: path.VERIFICATION, component: Verification },
      { id: "7", path: path.CONTACT_US, component: ContactUs },
      { id: "8", path: path.CHECK_MAIL_BOX, component: CheckMailBox },
      { id: "9", path: path.CHANGE_PASSWORD, component: ChangePassword },
      { id: "10", path: path.PRIVACY_POLICY, component: PrivacyPolicy },
      { id: "11", path: path.COOKIE_POLICY, component: CookiePolicy },
      {
        id: "12",
        path: path.TERMS_AND_CONDITIONS,
        component: TermsAndConditions,
      },
      { id: "13", path: path.FAQ, component: Faq },
      { id: "14", path: path.SERVER_ERROR, component: ServerError },
    ],
    dynamicRoutes: [
      {
        id: "1",
        path: path.CREATE_PROFILE,
        render: (props, user, client) => (
          <CreateProfile {...props} user={user} client={client} />
        ),
      },
      {
        id: "2",
        path: path.LISTINGS,
        render: (props, user, client) => (
          <Listings {...props} user={user} client={client} />
        ),
      },
      {
        id: "3",
        path: path.CREATE_NEW_POST,
        render: (props, user, client) => (
          <NewPost {...props} user={user} client={client} />
        ),
      },
      {
        id: "4",
        path: path.MATCHES,
        render: (props, user, client) => (
          <Matches {...props} user={user} client={client} />
        ),
      },
      {
        id: "5",
        path: path.NO_MATCHES,
        render: (props, user, client) => (
          <NoMatches {...props} user={user} client={client} />
        ),
      },
      {
        id: "6",
        path: path.MESSAGES,
        render: (props, user, client) => (
          <ChatsPage {...props} user={user} client={client} />
        ),
      },
      {
        id: "7",
        path: path.SETTINGS,
        render: (props, user, client) => (
          <Settings {...props} user={user} client={client} />
        ),
      },
      {
        id: "8",
        path: path.EDIT_PROFILE,
        render: (props, user, client) => (
          <CreateProfile {...props} user={user} client={client} />
        ),
      },
      {
        id: "9",
        path: path.EDIT_POST,
        render: (props, user, client) => (
          <NewPost {...props} user={user} client={client} editMode={true} />
        ),
      },
    ],
  };

  return (
    <Switch>
      {APP_ROUTES.staticRoutes.map((route) => (
        <Route
          exact
          key={route.id}
          path={route.path}
          component={route.component}
        />
      ))}{" "}
      <MainWrapp>
        {(user, client) => (
          <Suspense fallback={null}>
            <Switch>
              {APP_ROUTES.dynamicRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  exact={route.exact}
                  render={(props) => route.render(props, user, client)}
                />
              ))}
              <Route render={() => <PageNotFound />} />
            </Switch>
          </Suspense>
        )}
      </MainWrapp>
    </Switch>
  );
};
