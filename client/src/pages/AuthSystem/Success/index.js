import React from "react";
import { Button } from "semantic-ui-react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";

import * as path from "constants/routes";

const Success = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        icon={<ion-icon name="checkmark-circle-outline"></ion-icon>}
        title="success"
        subtitle="Your password has been successfully changed"
        {...props}
      >
        <Button
          style={{ background: "#639BE6" }}
          className="w-100"
          onClick={() => props.history.push("/")}
        >
          Done
        </Button>
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default Success;
