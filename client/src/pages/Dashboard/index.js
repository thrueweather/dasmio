import React from "react";
import ReactNotification from "react-notifications-component";

import NavBar from "components/NavBar/index";

import { withAuth } from "hocs/withAuth";

import "react-notifications-component/dist/theme.css";

const MainWrapp = ({ children, user, client, ...props }) => (
  <div>
    <NavBar user={user} client={client} {...props} />
    <ReactNotification />
    <div className="container-wrapp" id="content">
      <div className="container">
        <div>{children(user, client)}</div>
      </div>
    </div>
  </div>
);

export default withAuth(MainWrapp);
