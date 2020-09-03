import React from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../../CustomInput";

import * as query from "api/mutations";
import * as path from "constants/routes";

const ChangePasswordForm = (props) => {
  const ChangePassSchema = Yup.object().shape({
    password: Yup.string().required("Last password is required"),

    password1: Yup.string().required("New password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), null], "Password doesn't match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (changePassword, values, data) => {
    try {
      const response = await changePassword({
        variables: {
          ...values,
        },
      });
      if (response.data.changePassword.success) {
        alert("Success");
        // props.history.push(path.SUCCESS);
      }
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.changePassword}>
      {(changePassword, { loading }) => {
        return (
          <Formik
            initialValues={{
              password: "",
              password1: "",
              password2: "",
            }}
            validationSchema={ChangePassSchema}
            onSubmit={(form, data) => handleSubmit(changePassword, form, data)}
          >
            {({ values }) => (
              <Form>
                <Field
                  name="password"
                  type="password"
                  component={CustomInput}
                  placeholder="Last password"
                  value={values.password}
                  icon="lock"
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
                <div className="text-center pt-3">
                  <Button
                    style={{ background: "#639BE6" }}
                    type="submit"
                    className="d-block m-auto px-5 py-3 w-100"
                    loading={loading}
                  >
                    Change password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        );
      }}
    </Mutation>
  );
};

export default ChangePasswordForm;
