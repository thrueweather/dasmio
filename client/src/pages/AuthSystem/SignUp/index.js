import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import SignUpForm from "components/Forms/AuthSystemForms/SignUp";

const SignUp = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="create new account"
        subtitle="Use your email to create new account... it's free. "
        {...props}
      >
        <SignUpForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default SignUp;
