import React from "react";
import { Link } from "react-router-dom";

import { useClickOutside } from "utils/hooks";

import close from "assets/close.svg";

import "./style.scss";

const AuthSystemFormWrapp = ({
  icon,
  title,
  subtitle,
  children,
  withOutIcon,
  onClose,
  history,
}) => {
  const innerRef = React.useRef(null);
  useClickOutside(innerRef, () => history.push("/"));

  const customClose = onClose ? { to: "#", onClick: onClose } : { to: "/" };

  return (
    <div className="auth-form-wrapp" ref={innerRef}>
      {!withOutIcon && (
        <Link {...customClose}>
          <img className="close-icon" src={close} alt="" />
        </Link>
      )}
      {icon && <div className="auth-icon">{icon}</div>}
      <div className="title">{title}</div>
      <div className="subtitle pb-4">{subtitle}</div>
      {children}
    </div>
  );
};

export default AuthSystemFormWrapp;
