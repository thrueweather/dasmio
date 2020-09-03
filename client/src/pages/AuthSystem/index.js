import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { graphql } from "react-apollo";

import NavBar from "./NavBar";

import * as path from "constants/routes";
import * as query from "api/queries/index";

import "./style.scss";

const AuthSystemWrapp = props => {
  const token = JSON.parse(window.localStorage.getItem("token"));
  const authSystemWrapp = (
    <div className="auth">
      <div className="mx-5 auth-wrapp">
        <NavBar />
        <div className="title">
          <h1>
            Dasmio is how people meet. It's like real <br /> life, but better
          </h1>
          <div className="subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel
            pellentesque aenean at ac amet, massa. <br /> In tincidunt eu amet
            elit enim, massa quam tristique ac. Ut vitae adipiscing
          </div>
          <div className="buttons mt-5">
            <Link to={path.SIGN_IN}>
              <button className="mr-3">Sign in</button>
            </Link>
            <Link to={path.SIGN_UP}>
              <button>Sign up</button>
            </Link>
          </div>
        </div>
        <div className="text-center">{props.children}</div>
        <div className="footer text-center text-white pb-3">
          © Dasmio 2020. All rights reserved
        </div>
      </div>
    </div>
  );

  return props.history.action === "PUSH"
    ? authSystemWrapp
    : token !== null
    ? !props.user.loading &&
      props.user.me.isVerified && <Redirect to={path.LISTINGS} />
    : authSystemWrapp;
};

export default withRouter(
  graphql(query.USER, { name: "user" })(AuthSystemWrapp)
);
