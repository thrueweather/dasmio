import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";

import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

import { withRouter } from "react-router-dom";

import { saveData } from "utils/index";

import * as path from "constants/routes";
import * as query from "api/mutations";

import "./style.scss";

const VerificationForm = (props) => {
  const [values, setValues] = useState({ code: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, toggleSubmitting] = useState(false);

  useEffect(() => {
    if (values.code.length === 4) {
      if (props.history.location.state && props.history.location.state.email) {
        checkCode(values);
      } else {
        handleSubmit();
      }
    }
  }, [values.code]);

  const handleSubmit = () => {
    toggleSubmitting(true);
    props
      .verifyUser({
        variables: {
          code: values.code,
          // email: props.history.location.state.email, // зачем тут отправляется имейл?
        },
      })
      .then((response) => {
        if (response.data.verifyUser.errors.length) {
          setErrors({ code: "The code is wrong" });
          toggleSubmitting(false);
        } else {
          props.history.push(path.CREATE_PROFILE);
        }
      })
      .catch((e) => console.log(e.message));
  };

  const resendCode = (setErrors) => {
    toggleSubmitting(true);

    props
      .resendCode()
      .then((response) => {
        if (response.data.resendVerificationCode.success) {
          toggleSubmitting(false);
        } else {
          setErrors({ code: "The code is wrong" });
          toggleSubmitting(false);
        }
      })
      .catch((e) => console.log(e.message));
  };

  const checkCode = (data) => {
    props
      .verifyForgotPassword({
        variables: {
          code: data.code,
          email: props.history.location.state.email,
        },
      })
      .then((response) => {
        if (response.data.verifyForgotPassword.success) {
          saveData(response.data.verifyForgotPassword.token);
          props.history.push(path.CHANGE_PASSWORD);
        } else {
          console.log("ERRORS");
        }
      })
      .catch((e) => console.log(e.message));
  };
  return (
    <div>
      <div className=" pb-3">
        <Input
          type="number"
          placeholder="0000"
          value={values.code}
          onChange={(e) =>
            e.target.value.length <= 4 && setValues({ code: e.target.value })
          }
          className={`verification-field number-field ${
            errors.code && "error-field"
          }`}
          loading={isSubmitting}
        />
        <div
          className="error-field text-left"
          style={{ opacity: errors.code ? 1 : 0, transition: "0.3s all" }}
        >
          {errors.code}
        </div>
      </div>
      <div className="text-center mt-3">
        Did not receive the code?
        <span className="link pl-1" onClick={() => resendCode()}>
          Resend code
        </span>
      </div>
    </div>
  );
};

export default compose(
  graphql(query.verifyUser, { name: "verifyUser" }),
  graphql(query.resendCode, { name: "resendCode" }),
  graphql(query.verifyForgotPassword, { name: "verifyForgotPassword" })
)(withRouter(VerificationForm));
