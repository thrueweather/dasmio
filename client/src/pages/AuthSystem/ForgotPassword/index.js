import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import ForgotPasswordForm from "components/Forms/AuthSystemForms/ForgotPassword";

const ForgotPassword = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="forgot password?"
        subtitle={`We've sent a letter with code to ${
          (props.location.state && props.location.state.email) || "your email"
        }, please check inbox.`}
        {...props}
      >
        <ForgotPasswordForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default ForgotPassword;
