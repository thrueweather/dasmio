import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import VerificationForm from "components/Forms/AuthSystemForms/Verification";

const Verification = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="you are almost set up"
        subtitle={`We've sent a letter with code to ${
          props.location.state || "your email"
        },  please check inbox.`}
        {...props}
      >
        <VerificationForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default Verification;
