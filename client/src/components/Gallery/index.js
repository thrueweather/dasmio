import React, { useReducer, useCallback, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { withApollo } from "react-apollo";

import Modal from "components/Modal";
import AvatarEditor from "../AvatarEditor/index";
import Photo from "./Photo";
import Pagination from "./Pagination";

import { GALLERY } from "api/queries";
import { DELETE_IMAGE } from "api/mutations";
import { dataURLtoFile } from "utils";
import { initialState, reducer } from "./reducer";
import { IMAGE_UPLOADING_SIZE } from "constants/index";

import add from "assets/add.svg";

import "./styles.scss";

const Gallery = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    client,
    fileInputRef,
    selectPhoto,
    setImageFile,
    toggleModal,
    galleryModal,
    setAvatar,
    avatarModal,
    type,
    selectPhotos,
  } = props;

  const fetchData = async (page, perPage) => {
    try {
      const response = await client.query({
        query: GALLERY,
        variables: {
          page,
          perPage,
        },
        fetchPolicy: "no-cache",
      });

      return JSON.parse(response.data.gallery);
    } catch (error) {}
  };

  const handleGalleryFetch = useCallback(
    async (page, perPage) => {
      dispatch({ type: "TOGGLE_LOADER" });

      const data = await fetchData(page, perPage);

      dispatch({
        type: "SAVE_PHOTO",
        photos: data.gallery,
        numObjects: data.numObjects,
      });
    },
    [state.page, state.perPage]
  );

  useEffect(() => {
    handleGalleryFetch(state.page, state.perPage);
  }, [handleGalleryFetch, state.refetch]);

  useEffect(() => {
    if (avatarModal) {
      const image = selectPhoto.image;

      dispatch({
        type: "TOGGLE_EDIT_MODAL",
        action: {
          editModal: true,
          photo: image
            ? `${process.env.REACT_APP_CONST_BACKEND}/media/${image}`
            : null,
        },
      });
    }
  }, [avatarModal]);

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileSize = file.size / 1024 / 1024;

    if (fileSize <= IMAGE_UPLOADING_SIZE) {
      return dispatch({ type: "UPLOAD_PHOTO", photo: file });
    }

    dispatch({ type: "TOGGLE_ERROR_MODAL" });
  };

  const handleSaveImageOrAvatar = async (canvas, uploadImage) => {
    if (selectPhoto) {
      const file = dataURLtoFile(canvas.toDataURL(), selectPhoto.image);

      setImageFile(file);
      setAvatar({
        object: selectPhoto,
        image: canvas.toDataURL(),
      });
      dispatch({
        type: "TOGGLE_EDIT_MODAL",
        modal: "editModal",
      });
      toggleModal(false);
    } else {
      try {
        await uploadImage({
          variables: {
            upload: dataURLtoFile(canvas.toDataURL(), state.photo.name),
            sourceImage: state.photo,
          },
        });
        dispatch({ type: "TOGGLE_REFETCH" });
      } catch (error) {}
    }
  };

  const handleSwithModal = (modal) =>
    dispatch({ type: "TOGGLE_EDIT_MODAL", modal });

  const handleSelectPhoto = (photo) => {
    setImageFile(photo === selectPhoto ? null : photo);
  };

  const handleRemoveImage = async (imageId) => {
    try {
      const response = await client.mutate({
        mutation: DELETE_IMAGE,
        variables: {
          imageId,
        },
      });
      if (response.data.deleteImage.success) {
        const data = await fetchData(state.page, state.perPage);

        dispatch({
          type: "SAVE_PHOTO",
          photos: data.gallery,
          numObjects: data.numObjects,
        });
      }
    } catch (error) {}
  };

  const handleChangePage = (page) => dispatch({ type: "CHANGE_PAGE", page });

  return (
    <div className="gallery-wrapp">
      <div
        className="gallery-block"
        onClick={() => fileInputRef.current.click()}
      >
        <img className="add-photo" src={add} alt="" />
      </div>
      {state.photos.map((photo, index) => (
        <Photo
          key={index}
          state={state}
          photo={photo}
          selectPhoto={selectPhoto}
          setImageFile={setImageFile}
          handleSelectPhoto={handleSelectPhoto}
          handleRemoveImage={handleRemoveImage}
          loading={state.loader}
          cheched={
            selectPhotos && selectPhotos.find((item) => item.id === photo.id)
          }
          type={type}
        />
      ))}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleUploadPhoto}
        accept=".jpg, .jpeg, .png"
      />{" "}
      <Modal
        isOpen={state.editModal}
        toggleModal={() => handleSwithModal("editModal")}
        customStyles={{ width: 458 }}
        content={
          <div>
            <div className="edit-modal d-flex justify-content-between align-items-center">
              <h3 className="m-0">Photo</h3>
              <div>
                <Button
                  style={{ background: "#639BE6" }}
                  className="text-white mr-2"
                  onClick={() => {
                    props.toggleAvatarModal(false);
                    props.setImageFile(null);
                    handleSwithModal("editModal");
                  }}
                >
                  Back
                </Button>
                <Button
                  style={{
                    background: "linear-gradient(0deg, #F37474, #F37474)",
                  }}
                  className="text-white"
                  onClick={() => {
                    galleryModal(false);
                    if (avatarModal) {
                      props.setImageFile(null);
                      props.toggleAvatarModal(false);
                    }
                    handleSwithModal("editModal");
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="avatar-editor text-center">
              <AvatarEditor
                width={avatarModal ? 170 : 230}
                height={170}
                image={state.photo}
                borderRadius={avatarModal && 100}
                border={avatarModal ? 30 : [0, 20]}
                handleSaveImage={handleSaveImageOrAvatar}
                {...props}
              />
            </div>
          </div>
        }
      />
      <Modal
        isOpen={state.errorModal}
        toggleModal={() => handleSwithModal("editModal")}
        className="error-modal"
        customStyles={{ width: 200, height: 180, paddign: 0 }}
        content={
          <div className="error-modal text-center">
            <h3>Photo loading error:</h3>
            <p>
              Find a photo in one of these formats{" "}
              <strong>JPG, JPEG, PNG.</strong> <br /> {"Size < "}{" "}
              <strong>10mb</strong>
            </p>
            <Button
              className="primary-button w-100 mt-3"
              style={{ background: "#6EA7F4" }}
              onClick={() => dispatch({ type: "TOGGLE_ERROR_MODAL" })}
            >
              OK
            </Button>
          </div>
        }
      />
      {state.numObjects > 15 && (
        <Pagination
          numObjects={state.numObjects}
          handleChangePage={handleChangePage}
          page={state.page}
        />
      )}
    </div>
  );
};

export default withApollo(Gallery);
