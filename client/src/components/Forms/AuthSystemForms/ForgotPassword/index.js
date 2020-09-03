import React from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../CustomInput";

import * as path from "constants/routes";
import * as query from "api/mutations";

const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("E-mail is not valid!")
    .required("E-mail is required!")
});

const ForgotPassword = props => {
  const handleSubmit = (sendForgotPassword, form, data) => {
    sendForgotPassword({
      variables: {
        email: form.email
      }
    })
      .then(response => {
        if (response.data.sendForgotPassword.success) {
          props.history.push({
            pathname: path.CHECK_MAIL_BOX,
            state: { email: form.email }
          });
        } else {
          let errors = {};
          errors["email"] = response.data.sendForgotPassword.errors[0];
          data.setErrors(errors);
        }
      })
      .catch(e => console.log(e.message));
  };
  return (
    <Mutation mutation={query.sendForgotPassword}>
      {(sendForgotPassword, { loading }) => {
        return (
          <Formik
            initialValues={{
              email: ""
            }}
            validationSchema={ForgotSchema}
            onSubmit={(form, data) =>
              handleSubmit(sendForgotPassword, form, data)
            }
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
                <div className="text-center pt-3">
                  <Button
                    style={{ background: "#639BE6" }}
                    type="submit"
                    className="d-block m-auto px-5 py-3 w-100"
                    loading={loading}
                  >
                    Send
                  </Button>
                  <br />
                  <div className="text-center pb-3">
                    <div>
                      Don't have an account?{" "}
                      <Link to={path.SIGN_UP}>Sign up</Link>
                    </div>
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
export default ForgotPassword;
