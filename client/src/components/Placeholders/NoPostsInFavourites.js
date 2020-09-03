import React from "react";

import NoMatches from "./NoMatches";

const NoPostsInFavourites = ({ category }) => {
  return (
    <NoMatches
      title="Sorry!"
      category={category.text}
      subtitle={
        <p>
          At the moment there are no posts in the Favourites list. <br />{" "}
          Continue to browse posts and save the best listings.
        </p>
      }
    />
  );
};

export default NoPostsInFavourites;
