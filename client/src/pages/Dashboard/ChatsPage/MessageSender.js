import React from "react";

import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import * as Yup from "yup";

import { CustomInput } from "../../../components/Forms/CustomInput";

import PaperClip from "../../../assets/paperclip.svg";
import PaperPlaneOutline from "../../../assets/paper-plane-outline.svg";

import * as query from "api/mutations";

const MessageSender = (props) => {
  const handleSubmit = async (createMessage, values, data) => {
    try {
      const response = await createMessage({
        variables: {
          messageInput: {
            text: values.text,
            roomId: props.roomId,
          },
        },
      });
      if (response.data.createMessage.success) {
        props.refetch();
      }
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.CREATE_MESSAGE}>
      {(CREATE_MESSAGE, { loading }) => {
        return (
          <Formik
            initialValues={{
              text: "",
            }}
            onSubmit={(form, data) => handleSubmit(CREATE_MESSAGE, form, data)}
          >
            {({ values }) => (
              <Form>
                <div className={"message-sender"}>
                  <Button className="d-block send">
                    <img src={PaperClip} />
                  </Button>
                  <Field
                    name="text"
                    type="text"
                    component={CustomInput}
                    placeholder="Write a message..."
                    value={values.text}
                  />
                  <Button
                    type="submit"
                    className="d-block send"
                    loading={loading}
                  >
                    <img src={PaperPlaneOutline} />
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

export default MessageSender;
