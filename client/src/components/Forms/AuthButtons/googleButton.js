import React from "react";
import GoogleLogin from "react-google-login";
import { graphql } from "react-apollo";

import { withRouter } from "react-router";

import * as actions from "constants/social";
import * as query from "api/mutations";
import { saveData, deleteData } from "utils/index";
import google from "assets/google.svg";

const GoogleButton = props => {
  const handleSocialAuth = (provider, accessToken) => {
    deleteData();
    props
      .socialAuth({
        variables: {
          provider,
          accessToken
        }
      })
      .then(response => {
        if (!response.data.socialAuth.error) {
          const token = response.data.socialAuth.token;
          saveData(token);
          props.history.push("/");
        } else {
          let errors = {};
          response.data.socialAuth.error.validationErrors.map(error => {
            if (error["field"] === "__all__") {
              errors["provider"] = error["messages"].join(" ");
              errors["accessToken"] = error["messages"].join(" ");
            } else {
              errors[error] = error["messages"];
            }
            return null;
          });
        }
      })
      .catch(e => console.log(e.message));
  };
  const responseGoogle = response => {
    if (response.accessToken) {
      handleSocialAuth("google-oauth2", response.accessToken);
    }
  };
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_UID}
      render={renderProps => (
        <button
          type="button"
          onClick={renderProps.onClick}
          style={{ width: 160, height: 50 }}
        >
          <img src={google} alt="" />
          Google
        </button>
      )}
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default graphql(query.socialAuth, { name: "socialAuth" })(
  withRouter(GoogleButton)
);
