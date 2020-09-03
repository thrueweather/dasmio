import React from "react";
import { Link } from "react-router-dom";

import NoMatches from "./NoMatches";

import * as path from "constants/routes";

const AddPost = ({ subtitle, category }) => {
  return (
    <NoMatches
      title="Add post!"
      subtitle={
        subtitle || (
          <p>
            You have to{" "}
            <span style={{ color: "#6ea7f4" }}>
              <Link to={{ pathname: path.CREATE_NEW_POST, state: "matches" }}>
                add
              </Link>
            </span>{" "}
            your post first and we <br /> show you relevant posts near you
          </p>
        )
      }
      category={category && category.text}
    />
  );
};

export default AddPost;
