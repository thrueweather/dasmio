import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../CustomInput";

import * as path from "constants/routes";
import * as query from "api/mutations";
import FacebookButton from "../../AuthButtons/facebookButton";
import GoogleButton from "../../AuthButtons/googleButton";

import { saveData, deleteData } from "utils/index";

const SignUpForm = props => {
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("E-mail is not valid!")
      .required("E-mail is required!"),
    password: Yup.string()
      .min(8, `Password has to be longer than 8 characters!`)
      .required("Password is required!")
  });

  const handleSubmit = async (signIn, values, data) => {
    deleteData();
    try {
      const response = await signIn({
        variables: {
          ...values
        }
      });
      if (response.data.login.success) {
        saveData(response.data.login.token);
        if (response.data.login.user.isVerified) {
          if (!response.data.login.user.profiles.length) {
            props.history.push(path.CREATE_PROFILE);
          } else {
            props.history.push(path.LISTINGS);
          }
        } else {
          props.history.push(path.VERIFICATION);
        }
      } else {
        let errors = {};
        const errorData = response.data.login.errors;
        for (const key in errorData) {
          const element = errorData[key];
          if (element === "User with specified email does not exists.") {
            errors["email"] = element;
            continue;
          }
          errors["email"] = element;
          errors["password"] = element;
        }
        data.setErrors(errors);
      }
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.login}>
      {(signIn, { loading }) => {
        return (
          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={SignupSchema}
            onSubmit={(form, data) => handleSubmit(signIn, form, data)}
          >
            {({ values }) => (
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
                  name="password"
                  type="password"
                  component={CustomInput}
                  placeholder="New password"
                  value={values.password}
                  icon="lock"
                />
                <div className="text-center pt-3">
                  <Button
                    style={{ background: "#639BE6" }}
                    type="submit"
                    className="d-block m-auto px-5 py-3 w-100"
                    loading={loading}
                  >
                    Sign In
                  </Button>
                  <br />
                  <div className="d-flex justify-content-between text-left pb-3">
                    <div>
                      Don't have an account?{" "}
                      <Link to={path.SIGN_UP}>Sign up</Link>
                    </div>
                    <div>
                      <Link to={path.FORGOT_PASSWORD}>Forgot password?</Link>
                    </div>
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
