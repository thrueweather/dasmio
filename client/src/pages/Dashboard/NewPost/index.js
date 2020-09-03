import React from "react";
import { Mutation } from "react-apollo";

import NewPostForm from "components/Forms/NewPost";

import * as mutation from "api/mutations";
import * as path from "constants/routes";
import * as query from "api/queries/index";
import { showAlert } from "utils/index";

const NewPost = (props) => {
  const handleCreateNewPost = async (form, mutate) => {
    const { description, duration, gender, photos, category } = form.values;
    const editMode = props.location.pathname === path.EDIT_POST;
    const withPostId = editMode && { id: props.location.state.id };

    if (form.selectedItems.length >= 1) {
      try {
        const response = await mutate({
          variables: {
            postInput: {
              ...withPostId,
              photos: !editMode
                ? photos.map((photo) => photo.id)
                : props.location.state.photos.map((photo) => photo.id),
              lookingFor: gender,
              duration,
              age: form.values.age,
              categoryId: category,
              text: description,
              isMatches: !editMode && props.location.state ? true : false,
            },
          },
          refetchQueries: [
            { query: query.USER, fetchPolicy: "no-cache" },
            { query: query.MATCHES_CATEGORIES },
            { query: query.CATEGORIES },
          ],
        });
        if (response.data.createPost.success) {
          props.history.push(
            props.location.state ? path.MATCHES : path.LISTINGS,
            {
              ...response.data.createPost.post,
              age: form.values.age,
              lookingFor: gender,
            }
          );
          showAlert("Success!", "Post has been published");
        }
      } catch (error) {}
    } else {
      form.setErrorsPhotos(true);
    }
  };

  return (
    <Mutation mutation={mutation.CREATE_POST}>
      {(addPost, { data, loading }) => (
        <NewPostForm
          onSubmit={(form) => handleCreateNewPost(form, addPost)}
          loading={loading}
          {...props}
        />
      )}
    </Mutation>
  );
};

export default NewPost;
