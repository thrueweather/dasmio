import React from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../CustomInput";
import { CustomTextArea } from "../../CustomTextArea";

import * as query from "api/mutations";
import * as path from "constants/routes";

const ContactUsForm = props => {
  const ContactUsSchema = Yup.object().shape({
    email: Yup.string()
      .email("E-mail is not valid!")
      .required("E-mail is required!"),
    description: Yup.string().required("Description is required!")
  });

  const handleSubmit = async (contactUs, values, data) => {
    try {
      contactUs({
        variables: {
          senderEmail: values.email,
          message: values.description
        }
      }).then(response => {
        if (response.data.contactUs.success) props.history.push(path.SUCCESS);
        else console.log("errors");
      });
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.contactUs}>
      {(contactUs, { loading }) => {
        return (
          <Formik
            initialValues={{
              email: "",
              description: ""
            }}
            validationSchema={ContactUsSchema}
            onSubmit={(form, data) => handleSubmit(contactUs, form, data)}
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
                  name="description"
                  type="text"
                  component={CustomTextArea}
                  placeholder="Got something you want to talk about?"
                  value={values.description}
                  rows="8"
                  maxLength={400}
                />
                <Button
                  style={{ background: "#639BE6" }}
                  type="submit"
                  className="d-block mt-2 px-5 py-3 w-100"
                  loading={loading}
                >
                  Send message
                </Button>
              </Form>
            )}
          </Formik>
        );
      }}
    </Mutation>
  );
};

export default ContactUsForm;
