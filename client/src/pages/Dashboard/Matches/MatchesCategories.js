import React, { useState, useRef, useEffect } from "react";
import { Dropdown, Image } from "semantic-ui-react";

import * as query from "api/queries";
import { useQuery, useClickOutside } from "utils/hooks.js";

import "./style.scss";

const MatchesCategories = ({
  client,
  handleChangeSelection,
  location,
  history,
  categoryId,
  toggleHasPosts,
  selectedCategory,
  setCategory,
  handleSetCategory,
}) => {
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, switchSelect] = useState(false);

  const { getData, loading, error, data } = useQuery({
    client,
    endpoint: query.MATCHES_CATEGORIES,
    entity: "matchesCategories",
    router: history,
    fetchPolicy: "network-only",
  });

  const innerRef = useRef(null);

  useClickOutside(innerRef, () => {
    switchSelect(false);
    setSearchValue("");
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading && !data) return;

    const category = data.filter((category) => category.hasPosts === true)[0];

    if (!selectedCategory && !category) return;
    else if (!selectedCategory && category) {
      handleSetCategory({ category: category, ...category.posts[0] });
      toggleHasPosts(true);
    } else {
      toggleHasPosts(true);
    }
  }, [data]);

  const fetchData = async () => await getData();

  const handleSwithSelect = () => {
    if (isOpen) return;

    switchSelect(!isOpen);
  };

  const handleSetValue = (category, post) => {
    location.state && history.replace();
    handleChangeSelection("categoryId")({ category, ...post });
    setValue({ categoryName: category, ...post });
    setSearchValue("");
    switchSelect(false);
  };

  const handleChange = (e) => setSearchValue(e.target.value);

  const renderPostText = (text, splice) =>
    text && text.length >= splice ? text.slice(0, splice).concat("...") : text;

  const showValue = (options) => {
    const defaultValue =
      categoryId &&
      renderPostText(`${categoryId.category.name} - ${categoryId.text}`, 25);

    if (isOpen && searchValue) {
      return searchValue;
    } else if (isOpen && !searchValue) {
      return "";
    } else {
      return categoryId
        ? defaultValue
        : value &&
            renderPostText(`${value.categoryName.text} - ${value.text}`, 25);
    }
  };

  const SUBTITLE_LENGTH = 87;

  if (loading) {
    return (
      <Dropdown
        fluid
        selection
        search
        loading={loading}
        icon="grid layout"
        options={[]}
      />
    );
  }

  if (error) return `Error! ${error.message}`;

  const options = data.map((category) => ({
    key: category.id,
    text: category.name,
    value: category.id,
    ...category,
  }));
  const dynamicValue = {
    value: showValue(options),
    placeholder:
      (value && value.text) || (options.length > 0 && options[0].text),
  };
  const searchItems = options.filter((category) =>
    searchValue
      ? category.name.toLowerCase().includes(searchValue.toLowerCase())
      : category
  );

  return (
    <div className="matches-categories" ref={innerRef}>
      <div
        role="listbox"
        aria-expanded="false"
        className={`ui fluid selection dropdown search ${
          isOpen ? "active visible" : ""
        }`}
        onClick={handleSwithSelect}
      >
        <input
          type="text"
          {...dynamicValue}
          onChange={handleChange}
          className={!isOpen ? "is-open" : ""}
        />
        <i aria-hidden="true" className="grid layout icon"></i>
        <div
          className="menu transition"
          style={{ display: isOpen ? "block" : "none" }}
        >
          {searchItems.map((category) => (
            <div
              key={category.id}
              role="option"
              aria-checked="false"
              aria-selected="true"
              className="selected item"
            >
              <div className="item-wrap">
                <h3 className="text">{category.name}</h3>
                {category.posts.map((post) => (
                  <div
                    key={post.id}
                    className={`category ${
                      value.id === post.id ? "active" : ""
                    }`}
                    onClick={() => handleSetValue(category, post)}
                  >
                    <p>{renderPostText(post.text, SUBTITLE_LENGTH)}</p>
                    <div className="d-flex">
                      {post.photos.length > 0
                        ? post.photos
                            .slice(0, 5)
                            .map((photo) => (
                              <Image
                                key={photo.id}
                                size="mini"
                                src={`${process.env.REACT_APP_CONST_BACKEND}/media/${photo.image}`}
                              />
                            ))
                        : null}
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchesCategories;
