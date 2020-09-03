import React, { useEffect } from "react";

import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import ChangePassword from "components/Forms/Profile/Form/ChangePassword";

import "./styles.scss";

const Aссount = (props) => {
  useEffect(() => {
    props.setActiveLink(props.location.pathname);
  }, []);

  return (
    <div className="change-password">
      <AuthSystemFormWrapp
        title="change password"
        subtitle={
          <>
            Choose a password to protect your account. <br /> Password will be
            hard for other guess.
          </>
        }
        withOutIcon
      >
        <ChangePassword {...props} />
      </AuthSystemFormWrapp>
    </div>
  );
};

export default Aссount;
