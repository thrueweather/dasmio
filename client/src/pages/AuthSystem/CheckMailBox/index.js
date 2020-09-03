import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import CheckMailBoxForm from "components/Forms/AuthSystemForms/Verification";

const CheckMailBox = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="check your mailbox"
        subtitle={`We've sent a letter with code to ${
          (props.location.state && props.location.state.email) || "your email"
        }, please check inbox.`}
        {...props}
      >
        <CheckMailBoxForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default CheckMailBox;
