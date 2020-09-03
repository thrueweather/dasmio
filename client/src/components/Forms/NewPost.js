import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Dropdown } from "semantic-ui-react";
import { Query } from "react-apollo";
import * as Yup from "yup";

import { CustomTextArea } from "components/Forms/CustomTextArea";
import { CustomRange } from "components/Forms/CustomRange";
import { CustomSelect } from "components/Forms/CustomSelect";
import { CustomDropDown } from "components/Forms/CustomDropDown";

import Gallery from "components/Gallery";
import Modal from "components/Modal";

import { getItem } from "utils";
import * as query from "api/queries";

import add from "assets/add.svg";
import close from "assets/white-close.svg";

import "../Gallery/styles.scss";
import "./Listings/style.scss";

const NewPostSchema = Yup.object().shape({
  duration: Yup.string().required("Duration is required!"),
  description: Yup.string().required("Description is required!"),
  category: Yup.string().required("Category is required!"),
});

const placeholderStyles = {
  width: 105,
  height: 80,
  margin: 4,
  cursor: "auto",
};

const durationOptions = [
  { key: "1", value: "1", text: "1 hour" },
  { key: "3", value: "3", text: "3 hour" },
  { key: "9", value: "9", text: "9 hour" },
  { key: "12", value: "12", text: "12 hour" },
  { key: "24", value: "24", text: "24 hour" },
  { key: "72", value: "72", text: "72 hour" },
];

const NewPost = (props) => {
  const [modal, toggleModal] = useState(false);
  const [galleryModal, toggleGalleryModal] = useState(false);
  const [placeholders, setPlaceholder] = useState(
    props.editMode
      ? [
          ...props.location.state.photos,
          ...getItem(9 - props.location.state.photos.length),
        ]
      : getItem(9)
  );
  const [selectPhotos, setPhoto] = useState([]);
  const [avatarModal, toggleAvatarModal] = useState(false);
  const [errorsPhotos, setErrorsPhotos] = useState(false);

  const selectedItems = [];

  placeholders.forEach(
    (item) => typeof item === "object" && selectedItems.push(item)
  );

  useEffect(() => {
    if (selectedItems.length) {
      setErrorsPhotos(false);
    }
  }, [selectedItems]);

  const { imageFile } = props;

  const handleSetPhoto = (photo) => {
    const arr = [...selectPhotos];
    if (photo) {
      if (arr.length <= 9) {
        const samePhoto = selectPhotos.some((item) => item.id === photo.id);

        if (samePhoto) {
          return setPhoto(arr.filter((item) => item.id !== photo.id));
        }

        arr.push(photo);

        setPhoto(arr);
      }
    }
  };

  const handleRemoveImage = (photo) => {
    const filteredArray = placeholders.filter((item) => item.id !== photo.id);
    const onlyObjects = (array) =>
      array.filter((item) => typeof item === "object");

    if (placeholders.length === 10) {
      const arr = filteredArray;

      setPlaceholder([...arr]);
      setPhoto(onlyObjects(arr));
    } else {
      const photos = filteredArray;

      setPlaceholder([...photos, [].push(1)]);
      setPhoto(onlyObjects(photos));
    }
  };

  const handleApplyPhotos = () => {
    const getPlaceholders = getItem(9 - selectPhotos.length);

    setPlaceholder([...selectPhotos, ...getPlaceholders]);
    toggleGalleryModal(false);
  };

  const activeProfile = props.user.profiles.filter((prof) => prof.isActive)[0];

  const fileInputRef = useRef();

  return (
    <Formik
      initialValues={
        !props.editMode
          ? {
              photos: selectPhotos,
              gender: "Man",
              age: [18, 55],
              duration: "1",
              category: "",
              description: "",
            }
          : {
              photos: selectPhotos,
              age: [props.location.state.minAge, props.location.state.maxAge],
              description: props.location.state.text,
              duration: `${props.location.state.postDurationHours}`,
              gender:
                props.location.state.lookingFor === "MAN" ? "Man" : "Woman",
              category: props.location.state.category.id,
            }
      }
      validationSchema={NewPostSchema}
      enableReinitialize={true}
      onSubmit={(values, form) =>
        props.onSubmit({ values, form, selectedItems, setErrorsPhotos })
      }
    >
      {({ values, setFieldValue }) => (
        <Form className="profile-form new-post-from">
          <div className="text-center ">
            <img
              src={`${process.env.REACT_APP_CONST_BACKEND}/media/${
                activeProfile &&
                activeProfile.avatar &&
                activeProfile.avatar.image
              }`}
              onClick={() => toggleModal(true)}
              className="pointer avatar"
              alt=""
            />
            <h2 className="m-0 mt-2">
              <span>{activeProfile && activeProfile.name}</span>
            </h2>
            <p className="m-0">
              {(props.user && props.user.email) || "Example@mail.com"}
            </p>
          </div>
          <h3>Add post photos</h3>
          <div className="position-relative">
            <div className="gallery-wrapp ">
              <Modal
                isOpen={galleryModal}
                toggleModal={toggleGalleryModal}
                customStyles={{ width: 458, height: 478 }}
                trigger={
                  selectedItems.length < 10 ? (
                    placeholders.includes(1) ? (
                      <div
                        className="gallery-block"
                        onClick={() => toggleGalleryModal(true)}
                        style={{ ...placeholderStyles }}
                      >
                        <img className="add-photo" src={add} alt="" />
                      </div>
                    ) : (
                      <div
                        className="gallery-block"
                        onClick={() => toggleGalleryModal(true)}
                        style={{ width: 105, height: 80 }}
                      >
                        <img className="add-photo" src={add} alt="" />
                      </div>
                    )
                  ) : null
                }
                content={
                  <div>
                    <div className="gallery-modal d-flex justify-content-between align-items-center">
                      <h3 className="m-0">Photos</h3>
                      <div>
                        {imageFile && (
                          <Button
                            style={{
                              background: "#6EA7F4",
                            }}
                            onClick={() => toggleGalleryModal(true)}
                            className="text-white mr-2"
                          >
                            Set as avatar
                          </Button>
                        )}
                        <Button
                          onClick={() => toggleGalleryModal(false)}
                          style={{
                            background:
                              "linear-gradient(0deg, #F37474, #F37474)",
                          }}
                          className="text-white"
                        >
                          Close
                        </Button>
                        {selectPhotos.length ? (
                          <Button
                            onClick={handleApplyPhotos}
                            style={{ background: "#639BE6" }}
                            className="ml-2 text-white"
                          >
                            Apply
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Gallery
                        setImageFile={handleSetPhoto}
                        selectPhotos={selectPhotos}
                        fileInputRef={fileInputRef}
                        avatarModal={avatarModal}
                        toggleAvatarModal={toggleAvatarModal}
                        type="post"
                        min={0}
                        max={3}
                        {...props}
                      />
                    </div>
                  </div>
                }
              />
              {placeholders.map((item, index) =>
                typeof item === "number" ? (
                  <div
                    key={index}
                    className="gallery-block"
                    style={{ ...placeholderStyles }}
                  />
                ) : (
                  <div key={index} className="position-relative">
                    <img
                      className="gallery-block"
                      src={`${process.env.REACT_APP_CONST_BACKEND}/media/${item.image}`}
                      style={{ ...placeholderStyles }}
                      alt=""
                    />
                    <div
                      className="close-button"
                      onClick={() => handleRemoveImage(item)}
                      style={{ top: 4, right: 4 }}
                    >
                      <img src={close} alt="" />
                    </div>
                  </div>
                )
              )}
            </div>
            {errorsPhotos && (
              <div className="error-field" style={{ bottom: "-15px" }}>
                Photos is required!
              </div>
            )}
          </div>
          <h3>I`m looking for</h3>
          <div className="d-flex justify-content-between">
            <Button
              type="button"
              onClick={() => setFieldValue("gender", "Man")}
              className={`${
                values.gender === "Man" ? "primary-button" : "secondary-button"
              }  w-50`}
            >
              Man
            </Button>
            <Button
              type="button"
              onClick={() => setFieldValue("gender", "Woman")}
              className={`${
                values.gender === "Woman"
                  ? "primary-button"
                  : "secondary-button"
              }  w-50 mx-3`}
            >
              Woman
            </Button>
            <Button
              type="button"
              onClick={() => setFieldValue("gender", "Not matter")}
              className={`${
                values.gender === "Not matter"
                  ? "primary-button"
                  : "secondary-button"
              }  w-50`}
            >
              All
            </Button>
          </div>
          <div className="d-flex justify-content-between">
            <div className="w-50 mr-4">
              <h3>Duration</h3>
              <Field
                name="duration"
                component={CustomSelect}
                options={durationOptions}
                value={values.duration}
                className="w-100 select"
              />
            </div>
            <div className="w-75">
              <h3>
                Age: {values.age[0]} -{" "}
                {values.age[1] === 55 ? `${values.age[1]}+` : values.age[1]}{" "}
                y.o.
              </h3>
              <div className="bordered range">
                <CustomRange
                  value={values.age}
                  colors={["#E5E5E5", "#4F4F4F", "#E5E5E5"]}
                  backgroundColor="#FFFFFF"
                  min={18}
                  max={55}
                  width={270}
                  height={40}
                  onChange={(e) =>
                    e[1] >= 21 ? setFieldValue("age", e) : null
                  }
                />
              </div>
            </div>
          </div>
          <h3>Post category</h3>
          <Query query={query.CATEGORIES}>
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <Dropdown
                    fluid
                    selection
                    search
                    loading={loading}
                    placeholder="Category"
                    icon="grid layout"
                    options={[]}
                  />
                );
              if (error) return `Error! ${error.message}`;
              return (
                <Field
                  name="category"
                  component={CustomDropDown}
                  options={data.categories.map((category) => ({
                    key: category.id,
                    text: category.name,
                    value: category.id,
                  }))}
                  icon="grid layout"
                  value={values.category}
                  placeholder="Category"
                />
              );
            }}
          </Query>
          <h3>Post text</h3>
          <Field
            name="description"
            type="text"
            component={CustomTextArea}
            placeholder="Write a little bit about yourself..."
            value={values.description}
            rows="5"
            maxLength={330}
          />
          <div className="d-flex text-center mt-4">
            <Button
              type="button"
              className="secondary-button w-50 mr-2"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary-button w-50 ml-2"
              loading={props.loading}
            >
              Finish
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewPost;
