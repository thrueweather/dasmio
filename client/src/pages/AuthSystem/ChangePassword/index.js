import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import ChangePassForm from "components/Forms/AuthSystemForms/ChangePassword";

const ChangePassword = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp title="change password" {...props}>
        <ChangePassForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default ChangePassword;
