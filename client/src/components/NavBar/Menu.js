import React, { useRef } from "react";
import { Image, Loader } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import Skeleton from "react-loading-skeleton";
import ImageLoader from "react-imageloader";

import * as mutation from "api/mutations";
import * as path from "constants/routes";
import { useClickOutside } from "utils/hooks.js";

import signOut from "assets/sign-out.svg";
import plus from "assets/plus.svg";
import dropdownIcon from "assets/dropdown-icon.svg";
import whiteDropdown from "assets/white-dropdown.svg";

const Menu = ({
  select,
  user,
  handleLogOut,
  toggleSelect,
  history,
  handelSetActiveProfile,
}) => {
  const innerRef = useRef(null);

  useClickOutside(innerRef, () => toggleSelect(false));

  const notActiveProfiles = user.profiles.filter((prof) => !prof.isActive);

  const options = [
    {
      id: 1,
      name: "Add new profile",
      icon: plus,
      action: () => {
        history.push(path.CREATE_PROFILE);
        toggleSelect(!select);
      },
      visible: user.profiles.length >= 3 ? false : true,
    },
    {
      id: 2,
      name: "Profiles",
      icon: dropdownIcon,
      profiles: user.profiles,
      notActiveProfiles,
      visible: notActiveProfiles.length >= 1 ? true : false,
    },
    {
      id: 3,
      name: "Sign out",
      icon: signOut,
      action: () => handleLogOut(),
      visible: true,
    },
  ];

  const avatarStyles = {
    maxHeight: 24,
    alignItems: "center",
    display: "flex",
    marginLeft: 15,
    justifyContent: "flex-end",
  };

  const activeProfile = user.profiles.filter((profile) => profile.isActive)[0];

  return (
    <div className="pointer position-relative">
      <div onClick={() => toggleSelect(!select)} style={avatarStyles}>
        <span className="pr-3">{activeProfile && activeProfile.name}</span>
        <span className="pointer">
          {activeProfile.avatar && activeProfile.avatar.image ? (
            <>
              <img
                src={`${process.env.REACT_APP_CONST_BACKEND}/media/${
                  activeProfile.avatar && activeProfile.avatar.image
                }`}
                className="ui avatar image"
              />
              <img src={whiteDropdown} alt="" />
            </>
          ) : (
            <Skeleton circle={true} height={32} width={32} />
          )}
        </span>
      </div>
      {select && (
        <div className="secondary-select" ref={innerRef}>
          {options.map((option) =>
            option.notActiveProfiles && option.notActiveProfiles.length >= 1 ? (
              <div key={option.id} className="option">
                <div onClick={option.action}>
                  <span>
                    {option.name} <img src={option.icon} alt="" />
                  </span>
                </div>
                {option.notActiveProfiles.map((profile) => (
                  <Mutation
                    mutation={mutation.SET_ACTIVE_PROFILE}
                    key={profile.id}
                  >
                    {(setActiveProfile, { data, loading }) => (
                      <div
                        className="pt-2"
                        onClick={() =>
                          handelSetActiveProfile(setActiveProfile, profile.id)
                        }
                      >
                        <div className="pointer">
                          {!data && loading ? (
                            <div
                              className="d-flex align-items-center"
                              style={{ height: 32 }}
                            >
                              Loading...
                            </div>
                          ) : (
                            <>
                              <ImageLoader
                                src={`${
                                  process.env.REACT_APP_CONST_BACKEND
                                }/media/${
                                  profile.avatar && profile.avatar.image
                                }`}
                                className="ui avatar image"
                                preloader={() => <Loader active />}
                              >
                                <Image
                                  src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                                  avatar
                                />
                              </ImageLoader>
                              {profile.name}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Mutation>
                ))}
              </div>
            ) : option.visible ? (
              <div key={option.id} className="option" onClick={option.action}>
                <span>
                  {option.name} <img src={option.icon} alt="" />
                </span>
                <br />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
