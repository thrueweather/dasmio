import React, { useState, useEffect } from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";

import CreateProfileForm from "components/Forms/Profile/Form";

import * as path from "constants/routes";
import * as query from "api/mutations";
import { USER } from "api/queries";
import { showAlert } from "utils/index";

const CreateProfile = (props) => {
  const [imageFile, setImageFile] = useState(null);
  const [avatar, setAvatar] = useState({ object: null, image: null });
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (avatar.image) setAvatarError(false);
  }, [avatar.image, avatar.object]);

  const handleUploadAvatar = async (profile) => {
    try {
      const repsonse = await props.client.mutate({
        mutation: query.setAvatar,
        variables: {
          profileId: profile.id,
          upload: imageFile,
          galleryImageId: avatar.object.id,
        },
        refetchQueries: [{ query: USER, fetchPolicy: "no-cache" }],
      });
      if (repsonse.data.setAvatar.success) {
        props.history.goBack();
        props.user.profiles.length &&
          showAlert("Success!", "The profile has been successfully created");
      }
    } catch (error) {}
  };

  const editMode = props.location.pathname === path.EDIT_PROFILE;

  const handleSubmit = async (form, createProfile) => {
    const withProfileId = editMode && { id: props.location.state.id };
    if ((avatar.object && avatar.object.id) || props.location.state.avatar.id) {
      try {
        const repsonse = await createProfile({
          variables: {
            profileInput: {
              ...withProfileId,
              name: form.values.name,
              education: form.values.education,
              job: form.values.job,
              description: form.values.description,
              gender: form.values.gender,
              age: form.values.age.toString(),
            },
          },
          refetchQueries: [{ query: USER, fetchPolicy: "no-cache" }],
        });
        if (repsonse.data.createProfile.success) {
          await handleUploadAvatar(repsonse.data.createProfile.profile);
        }
      } catch (error) {}
    } else {
      setAvatarError(true);
    }
  };

  const createMode =
    props.location.pathname === path.CREATE_PROFILE &&
    props.user.profiles.length !== 3;

  if (editMode || createMode) {
    return (
      <Mutation mutation={query.СREATE_PROFILE}>
        {(createProfile, { loading, data }) => {
          return (
            <CreateProfileForm
              {...props}
              onSubmit={(form) => handleSubmit(form, createProfile)}
              loading={loading}
              imageFile={imageFile}
              avatar={avatar}
              setImageFile={setImageFile}
              setAvatar={setAvatar}
              avatarError={avatarError}
              setAvatarError={setAvatarError}
              variables={props.location.state}
            />
          );
        }}
      </Mutation>
    );
  }
  return <Redirect to={path.LISTINGS} />;
};

export default CreateProfile;
