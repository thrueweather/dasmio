import React, { useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { withApollo } from "react-apollo";

import { useQuery } from "utils/hooks.js";
import * as query from "api/queries";
import * as path from "constants/routes";

export const withUserProfile = (Route) => {
  const RouteWithProfile = withRouter(
    withApollo((props) => {
      const { getData, loading, error, data } = useQuery({
        client: props.client,
        endpoint: query.USER,
        entity: "me",
        router: props.history,
        fetchPolicy: "network-only",
      });

      useEffect(() => {
        getData();
      }, []);

      if (loading || !data) return null;
      if (error) return null;

      if (!data.profiles.length) {
        return <Redirect to={path.CREATE_PROFILE} />;
      }

      return <Route {...props} />;
    })
  );

  return React.memo(RouteWithProfile);
};
