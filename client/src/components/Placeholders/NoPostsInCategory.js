import React from "react";
import { Checkbox } from "semantic-ui-react";
import { Link } from "react-router-dom";

import NoMatches from "./NoMatches";

import * as path from "constants/routes";

const NoPostsInCategory = ({ category }) => {
  return (
    <NoMatches
      title="Sorry!"
      category={category.text}
      subtitle={
        <p>
          At the moment there are no posts in the{" "}
          <strong>{category.text}</strong> category,
          <br /> come back a little later and they will appear or set a
          notification.
        </p>
      }
    >
      <Checkbox
        label={
          <>
            <label>
              Receive notification of new posts in{" "}
              <strong>{category.text} </strong>
              category (You can configure alerts{" "}
              <Link to={path.NOTIFICATIONS}>here</Link>)
            </label>
          </>
        }
      />
    </NoMatches>
  );
};

export default NoPostsInCategory;
