import React from "react";
import { Button } from "semantic-ui-react";

import { Link } from "react-router-dom";
import Switch from "react-switch";

import MatchesCategories from "./MatchesCategories";

import * as path from "constants/routes";

const Toolbar = ({
  handleChangeSelection,
  categoryId,
  selectedCategory,
  favorite,
  likedMe,
  history,
  location,
  isMatched,
  toggleHasPosts,
  handleSetCategory,
  client,
}) => {
  return (
    <div className="toolbar">
      <div
        className="d-flex w-100"
        style={
          isMatched ? { opacity: 1 } : { pointerEvents: "none", opacity: 0 }
        }
      >
        <div className="mr-4">
          <p>Match by</p>
          <MatchesCategories
            favorite={favorite}
            categoryId={categoryId}
            handleChangeSelection={handleChangeSelection}
            location={location}
            history={history}
            toggleHasPosts={toggleHasPosts}
            selectedCategory={selectedCategory}
            handleSetCategory={handleSetCategory}
            client={client}
          />
        </div>
        <div className="mr-4">
          <p>Like me</p>
          <div className="bordered">
            <Switch
              onChange={handleChangeSelection("likedMe")}
              checked={likedMe}
              uncheckedIcon={false}
              checkedIcon={false}
              offColor="#E0E0E0"
              onColor="#33333"
            />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-between text-center">
          <Link
            to={path.SETTINGS_MATCHES}
            className="text-left"
            style={{ marginBottom: 11 }}
          >
            <div className="link">Manage posts</div>
          </Link>

          <Button
            className="primary-button m-0"
            onClick={() => history.push(path.CREATE_NEW_POST, "matches")}
          >
            Add new post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
