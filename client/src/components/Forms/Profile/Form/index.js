import React, { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Checkbox } from "semantic-ui-react";
import * as Yup from "yup";

import { CustomInput } from "../../CustomInput";
import { CustomTextArea } from "../../CustomTextArea";
import { CustomRange } from "../../CustomRange";
import Modal from "components/Modal";
import Gallery from "../../../Gallery";

import profileAvatar from "assets/profile-avatar.svg";
import errorAvatar from "assets/error-avatar.svg";
import photo from "assets/photo.svg";

const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  gender: Yup.string().required("Gender is required!"),
});

const CreateProfile = (props) => {
  const [modal, toggleModal] = useState(false);
  const [avatarModal, toggleAvatarModal] = useState(false);

  const fileInputRef = useRef();

  const { imageFile, avatar, setImageFile, setAvatar } = props;

  return (
    <Formik
      initialValues={
        props.variables
          ? {
              ...props.location.state,
              age: [props.location.state.age],
              gender:
                props.location.state.gender === "MALE" ? "Male" : "Female",
            }
          : {
              name: props.user.fullName,
              education: "",
              job: "",
              description: "",
              age: [28],
              gender: "",
            }
      }
      validationSchema={profileSchema}
      onSubmit={(values, form) => props.onSubmit({ values, form })}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form className="profile-form">
          <div className="text-center">
            <Modal
              isOpen={modal}
              toggleModal={toggleModal}
              customStyles={{ width: 458, height: 478 }}
              trigger={
                <div className="profile-form-avatar">
                  <img
                    src={
                      !props.variables
                        ? !props.avatarError
                          ? avatar.image || profileAvatar
                          : errorAvatar
                        : `${process.env.REACT_APP_CONST_BACKEND}/media/${
                            props.location.state &&
                            props.location.state.avatar.image
                          }`
                    }
                    alt=""
                    onClick={() => toggleModal(true)}
                    className={`pointer ${
                      (props.location.state &&
                        props.location.state.avatar.image) ||
                      avatar.image
                        ? "avatar"
                        : ""
                    }`}
                  />
                  {avatar.image && (
                    <img
                      src={photo}
                      onClick={() => toggleModal(true)}
                      className="photo"
                      alt=""
                    />
                  )}
                </div>
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
                          onClick={() => toggleAvatarModal(true)}
                          className="text-white mr-2"
                        >
                          Set as avatar
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          toggleModal(false);
                          setImageFile(false);
                        }}
                        style={{
                          background: "linear-gradient(0deg, #F37474, #F37474)",
                        }}
                        className="text-white m-0"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Gallery
                      galleryModal={toggleModal}
                      fileInputRef={fileInputRef}
                      setImageFile={setImageFile}
                      setAvatar={setAvatar}
                      selectPhoto={imageFile}
                      avatarModal={avatarModal}
                      toggleAvatarModal={toggleAvatarModal}
                      toggleModal={toggleModal}
                      handleUploadImage={props.handleUploadImage}
                      min={0}
                      max={3}
                      {...props}
                    />
                  </div>
                </div>
              }
            />
            <h2 className="m-0 mt-2">
              <span style={{ opacity: !values.name ? 0 : 1 }}>
                {values.name || " Field for name "}
              </span>
            </h2>
            <p className="m-0">
              {(props.user && props.user.email) || "Example@mail.com"}
            </p>
          </div>
          <h3 style={{ marginTop: 20 }}>New profile</h3>
          <div className="position-relative">
            <Field
              name="name"
              type="name"
              component={CustomInput}
              placeholder="Name"
              icon="user"
              className="outline"
              value={values.name}
              maxLength={50}
            />
          </div>
          <Field
            name="education"
            type="education"
            component={CustomInput}
            placeholder="Education"
            icon="graduation"
            value={values.education}
          />
          <Field
            name="job"
            type="job"
            component={CustomInput}
            placeholder="Job"
            icon="building"
            value={values.job}
          />
          <Field
            name="description"
            type="text"
            component={CustomTextArea}
            placeholder="Write a little bit about yourself..."
            value={values.description}
            rows="5"
            maxLength={330}
          />
          <h3 className="mt-3 mb-2">Choose your age: {values.age}</h3>
          <Field
            name="age"
            component={CustomRange}
            min={18}
            max={99}
            colors={["#E5E5E5", "#4F4F4F", "#E5E5E5"]}
            backgroundColor="#FFFFFF"
            value={values.age}
          />
          <div className="position-relative">
            <h3 className="mt-3 mb-2">Gender</h3>
            <Checkbox
              radio
              label="Man"
              name="checkboxRadioGroup"
              value="Male"
              checked={values.gender === "Male"}
              onChange={(e, x) => setFieldValue("gender", x.value)}
            />
            <Checkbox
              radio
              label="Woman"
              name="checkboxRadioGroup"
              value="Female"
              className="ml-5"
              checked={values.gender === "Female"}
              onChange={(e, x) => setFieldValue("gender", x.value)}
            />
            <div
              className="error-field text-left"
              style={{
                opacity: touched.gender && errors.gender ? 1 : 0,
                transition: "0.3s all",
              }}
            >
              {errors.gender}
            </div>
          </div>

          <div className="d-flex text-center mt-4">
            <Button
              type="submit"
              className="primary-button m-auto"
              onClick={() => !avatar.image && props.setAvatarError(true)}
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

export default CreateProfile;
