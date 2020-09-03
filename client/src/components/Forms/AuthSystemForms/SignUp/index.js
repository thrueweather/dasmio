import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, Checkbox, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../CustomInput";

import * as path from "constants/routes";
import * as query from "api/mutations";
import { saveData, deleteData } from "utils";

import FacebookButton from "../../AuthButtons/facebookButton";
import GoogleButton from "../../AuthButtons/googleButton";

const SignUpForm = props => {
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("E-mail is not valid!")
      .required("E-mail is required!"),
    password1: Yup.string().required("Password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), null], "Password doesn't match")
      .required("Password confirm is required"),
    accept: Yup.bool().oneOf([true], "Accept field must be checked")
  });

  const handleSubmit = async (signUp, values, data) => {
    deleteData();
    try {
      const response = await signUp({
        variables: {
          userInput: {
            email: values.email,
            password1: values.password1,
            password2: values.password2
          }
        }
      });
      if (!response.data.register.success) {
        let errors = {};
        const errorData = response.data.register.errors;
        for (const key in errorData) {
          const element = errorData[key];
          if (
            element === "User with specified email does not exists." ||
            element === "User with specified email already exists."
          ) {
            errors["email"] = element;
            continue;
          }
          errors["email"] = element;
          errors["password1"] = element;
          errors["password2"] = element;
        }
        return data.setErrors(errors);
      }
      saveData(response.data.register.token);
      props.history.push(path.VERIFICATION, values.email);
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.register}>
      {(signUp, { loading }) => {
        return (
          <Formik
            initialValues={{
              email: "",
              password1: "",
              password2: "",
              accept: false
            }}
            validationSchema={SignupSchema}
            onSubmit={(form, data) => handleSubmit(signUp, form, data)}
          >
            {({ values, touched, errors, setFieldValue }) => (
              <Form>
                <Field
                  name="email"
                  type="email"
                  component={CustomInput}
                  placeholder="Example@mail.com"
                  icon="mail"
                  value={values.email}
                />
                <Field
                  name="password1"
                  type="password"
                  component={CustomInput}
                  placeholder="New password"
                  value={values.password1}
                  icon="lock"
                />
                <Field
                  name="password2"
                  type="password"
                  component={CustomInput}
                  placeholder="Confirm password"
                  value={values.password2}
                  icon="lock"
                />
                <div className="text-left">
                  <Checkbox
                    label="Accept"
                    onChange={e => setFieldValue("accept", !values.accept)}
                  />{" "}
                  <a
                    href={path.TERMS_AND_CONDITIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>
                  <div
                    className="error-field text-left"
                    style={{
                      opacity: touched.accept && errors.accept ? 1 : 0,
                      transition: "0.3s all",
                      marginTop: "-3px"
                    }}
                  >
                    {errors.accept}
                  </div>
                </div>
                <div className="text-center pt-3">
                  <Button
                    style={{ background: "#639BE6" }}
                    type="submit"
                    className="d-block m-auto px-5 py-3 w-100"
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                  <br />
                  <div className="text-left pb-3">
                    Already have an account?{" "}
                    <Link to={path.SIGN_IN}>Sign in</Link>
                  </div>
                  <Divider horizontal>or with</Divider>
                  <div className="d-flex justify-content-between pt-3 social-button">
                    <GoogleButton />
                    <FacebookButton />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        );
      }}
    </Mutation>
  );
};

export default SignUpForm;
