import React, { useState } from "react";
import { Link } from "react-router-dom";

import { CustomSelect } from "components/Forms/CustomSelect";

import logo from "assets/logo.svg";

import i18n from "i18n";

import * as path from "../../constants/routes";

import "./style.scss";

const NavBar = () => {
  const [language, setLanguage] = useState("en");

  i18n.changeLanguage(language);

  const handleLanguageChange = value => {
    setLanguage(value);
    i18n.changeLanguage(language);
  };

  const routes = [
    { id: "1", title: "Contact us", path: path.CONTACT_US, spa: true },
    { id: "2", title: "Cookie Policy", path: path.COOKIE_POLICY },
    { id: "3", title: "Privacy Policy", path: path.PRIVACY_POLICY },
    { id: "4", title: "Terms and Conditions", path: path.TERMS_AND_CONDITIONS },
    { id: "5", title: "FAQ", path: path.FAQ }
  ];

  const languageOptions = [
    { key: "en", value: "en", text: "EN" },
    { key: "ru", value: "ru", text: "RU" }
  ];

  return (
    <div className="d-flex justify-content-between align-items-center text-center text-white pt-3 auth-navbar">
      <div>
        <img src={logo} alt="" />
      </div>
      <div>
        {routes.map(route =>
          route.spa ? (
            <Link key={route.id} to={route.path} className="px-3">
              {route.title}
            </Link>
          ) : (
            <a
              key={route.id}
              target="_blank"
              rel="noopener noreferrer"
              href={route.path}
              className="px-3"
            >
              {route.title}
            </a>
          )
        )}
      </div>
      <div>
        <CustomSelect
          value={language}
          onChange={handleLanguageChange}
          options={languageOptions}
          className="language"
          form={{
            touched: [],
            errors: []
          }}
          field={{
            name: ""
          }}
          icon="chevron down"
        />
      </div>
    </div>
  );
};

export default NavBar;
