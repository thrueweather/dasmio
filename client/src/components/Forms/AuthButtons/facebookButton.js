import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { graphql } from "react-apollo";
import { withRouter } from "react-router";

import * as query from "api/mutations";
import { saveData, deleteData } from "utils/index";
import facebook from "assets/facebook.svg";

const FacebookButton = props => {
  const responseFacebook = response => {
    if (response.accessToken) {
      handleSocialAuth("facebook", response.accessToken);
    }
  };

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

  return (
    <div>
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_UID}
        fields="name,email,picture"
        callback={responseFacebook}
        render={renderProps => (
          <button
            type="button"
            className="facebook"
            onClick={renderProps.onClick}
            style={{ width: 160, height: 50 }}
          >
            <img src={facebook} alt="" />
            Facebook
          </button>
        )}
      />
    </div>
  );
};

export default graphql(query.socialAuth, { name: "socialAuth" })(
  withRouter(FacebookButton)
);
