import React from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Switch from "react-switch";

import { CustomRange } from "components/Forms/CustomRange";

import * as path from "constants/routes";
import * as query from "api/queries";

const Toolbar = ({
  handleChangeSelection,
  categoryId,
  lookingFor,
  age,
  favorite,
  activeProfile,
  perPage,
  loading,
}) => {
  const isLoading = loading || favorite;
  return (
    <div className="toolbar">
      <div className="d-flex w-100">
        <div>
          <p>Category</p>
          <Query query={query.CATEGORIES}>
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <Dropdown
                    fluid
                    selection
                    search
                    loading={loading}
                    className="mr-4"
                    icon="grid layout"
                    disabled={isLoading}
                    options={[]}
                  />
                );
              if (error) return `Error! ${error.message}`;
              const options = data.categories.map((category) => ({
                key: category.id,
                text: category.name,
                value: category.id,
              }));
              return (
                <Dropdown
                  fluid
                  selection
                  search
                  id="categoryId"
                  icon="grid layout"
                  className="mr-4"
                  disabled={isLoading}
                  placeholder={options.length >= 1 && options[0].text}
                  value={`${categoryId}`}
                  onChange={(e, data) =>
                    handleChangeSelection("categoryId")(data.value)
                  }
                  options={options}
                />
              );
            }}
          </Query>
        </div>
        <div>
          <p>Gender</p>
          <Dropdown
            fluid
            selection
            icon="other gender"
            className="gender search mr-4"
            disabled={isLoading}
            value={lookingFor}
            onChange={(e, data) =>
              handleChangeSelection("lookingFor")(data.value)
            }
            options={[
              { key: "Man", text: "Man", value: "Man" },
              { key: "Woman", text: "Woman", value: "Woman" },
              {
                key: "All",
                text: "All",
                value: "Not matter",
              },
            ]}
          />
        </div>
        <div>
          <p>
            Age: {age[0]} - {age[1] === 55 ? `${age[1]}+` : age[1]} y.o.
          </p>
          <div
            className="bordered range"
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <CustomRange
              value={age}
              colors={["#E5E5E5", "#4F4F4F", "#E5E5E5"]}
              backgroundColor="#FFFFFF"
              min={18}
              max={55}
              width={385}
              height={40}
              disabled={isLoading}
              onChange={handleChangeSelection("age")}
            />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="mr-4">
          <p>Favorites</p>
          <div className="bordered">
            <Switch
              onChange={handleChangeSelection("favorite")}
              checked={favorite}
              uncheckedIcon={false}
              disabled={loading}
              checkedIcon={false}
              offColor="#E0E0E0"
              onColor="#333333"
            />
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between text-center">
          <Link to={path.SETTINGS} className="text-left">
            <div className="link">Manage posts</div>
          </Link>
          <Link to={path.CREATE_NEW_POST}>
            <Button className="primary-button m-0">Add new post</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
