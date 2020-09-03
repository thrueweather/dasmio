import React, { useEffect } from "react";
import { withApollo, Query } from "react-apollo";
import { withRouter } from "react-router-dom";

import { VERIFY_TOKEN } from "api/mutations";
import { USER } from "api/queries";
import * as path from "constants/routes";

export const withAuth = (WrappedComponent) =>
  withRouter(
    withApollo((props) => {
      useEffect(() => {
        verifyUser();
      }, []);

      const verifyUser = async () => {
        try {
          await props.client.mutate({
            mutation: VERIFY_TOKEN,
            variables: {
              token: JSON.parse(localStorage.getItem("token")).token || "",
            },
            fetchPolicy: "no-cache",
          });
        } catch (error) {
          props.history.push(path.SIGN_IN);
          window.localStorage.removeItem("token");
        }
      };

      return (
        <Query query={USER} fetchPolicy="network-only">
          {({ loading, error, data }) => {
            if (loading || !data) return null;
            if (error) return null;
            return <WrappedComponent {...props} user={data.me} />;
          }}
        </Query>
      );
    })
  );
