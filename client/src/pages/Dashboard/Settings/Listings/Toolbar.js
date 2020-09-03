import React from "react";
import { Query } from "react-apollo";
import { Dropdown, Select } from "semantic-ui-react";

import { STATUSES } from "constants/index";
import * as query from "api/queries";

import "../../Listings/style.scss";

const Toolbar = ({ handleChangeSelection, filters }) => {
  return (
    <div className="toolbar">
      <div className="d-flex w-100">
        <div className="mr-4">
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
                    disabled={loading}
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
                  id="category"
                  icon="grid layout"
                  className="mr-4"
                  disabled={loading}
                  placeholder={options.length >= 1 && options[0].text}
                  value={`${filters.category}`}
                  onChange={(e, data) =>
                    handleChangeSelection("category")(data.value)
                  }
                  options={options}
                />
              );
            }}
          </Query>
        </div>
        <div>
          <p>Status</p>
          <Select
            value={"All"}
            placeholder={"placeholder"}
            options={STATUSES}
            onChange={(e, data) => handleChangeSelection("status")(data.value)}
            value={filters.status}
            className="select"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
