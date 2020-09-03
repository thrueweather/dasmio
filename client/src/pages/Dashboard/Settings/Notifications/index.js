import React, { useState, useEffect } from "react";
import { Checkbox } from "semantic-ui-react";
import { Link } from "react-router-dom";

import Chip from "./Chip";

import * as path from "constants/routes";

import "./styles.scss";

const Notification = (props) => {
  const [chips, setChip] = useState({
    matches: [
      { id: 1, category: "Dating", text: "Post text: Design prof" },
      { id: 2, category: "Dating", text: "Post text: Design prof" },
      { id: 3, category: "Dating", text: "Post text: Design prof" },
    ],
    listings: [
      { id: 1, text: "Post text: Design prof" },
      { id: 2, text: "Post text: Design prof" },
    ],
  });
  const [value, setValue] = useState({
    matchesValue: "",
    listingsValue: "",
  });

  useEffect(() => {
    props.setActiveLink(props.location.pathname);
  }, []);

  const handleChangeValue = (type) => (e) => {
    setValue({
      ...value,
      [type]: e.target.value,
    });
  };

  const handleCreateChip = (type) => (e) => {
    e.preventDefault();

    if (value.matchesValue || value.listingsValue) {
      const withCategory = type === "matches" && { category: "Dating" };

      setChip({
        ...chips,
        [type]: chips[type].concat({
          id: chips[type].length + 1,
          ...withCategory,
          text: type === "matches" ? value.matchesValue : value.listingsValue,
        }),
      });

      setValue({ matchesValue: "", listingsValue: "" });
    }
  };

  const handleRemoveChip = (type, id) => {
    setChip({
      ...chips,
      [type]: chips[type].filter((chip) => chip.id !== id),
    });
  };

  const withOutBorder = {
    padding: "32px 28px 23px 32px",
    borderBottom: "none",
  };

  return (
    <div className="notifications">
      <table color="#e0e0e0" className="w-100">
        <thead>
          <tr>
            <th style={{ width: 367 }}>Notifications</th>
            <th style={{ width: 50 }}>Email </th>
            <th>Push</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Like you</td>
            <td>
              <Checkbox checked={false} />
            </td>
            <td>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td>Super Like</td>
            <td>
              <Checkbox checked={false} />
            </td>
            <td>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td>New listing response </td>
            <td>
              <Checkbox checked={false} />
            </td>
            <td>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td>New match</td>
            <td>
              <Checkbox checked={false} />
            </td>
            <td>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td>New message</td>
            <td>
              <Checkbox checked={false} />
            </td>
            <td>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td style={withOutBorder}>
              New post{" "}
              <Link to={path.MATCHES} className="link">
                in Matches list
              </Link>{" "}
            </td>
            <td style={withOutBorder}>
              <Checkbox checked={false} />
            </td>
            <td style={withOutBorder}>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td
              style={{ background: "white", padding: "0 32px 28px" }}
              colSpan={3}
            >
              <div className="expanded-row">
                {chips.matches.map((chip, index) => (
                  <Chip
                    key={chip.id}
                    category={chip.category}
                    text={chip.text}
                    handleRemoveChip={handleRemoveChip}
                    type="matches"
                    {...chip}
                  />
                ))}
                <form onSubmit={handleCreateChip("matches")}>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={value.matchesValue}
                    onChange={handleChangeValue("matchesValue")}
                  />
                </form>
              </div>
            </td>
          </tr>
          <tr>
            <td style={withOutBorder}>
              New post{" "}
              <Link to={path.LISTINGS} className="link">
                in Listings list
              </Link>{" "}
            </td>
            <td style={withOutBorder}>
              <Checkbox checked={false} />
            </td>
            <td style={withOutBorder}>
              <Checkbox checked={true} />
            </td>
          </tr>
          <tr>
            <td
              style={{ background: "white", padding: "0 32px 28px" }}
              colSpan={3}
            >
              <div className="expanded-row">
                {chips.listings.map((chip, index) => (
                  <Chip
                    key={chip.id}
                    text={chip.text}
                    type="listings"
                    handleRemoveChip={handleRemoveChip}
                    {...chip}
                  />
                ))}
                <form onSubmit={handleCreateChip("listings")}>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={value.listingsValue}
                    onChange={handleChangeValue("listingsValue")}
                  />
                </form>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Notification;
