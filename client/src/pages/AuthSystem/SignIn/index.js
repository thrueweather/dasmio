import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import SignInForm from "components/Forms/AuthSystemForms/SignIn";

const SignUp = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="sign in"
        subtitle="Since we use many of the same online services"
        {...props}
      >
        <SignInForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default SignUp;
