import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";

import { Mutation } from "react-apollo";
import * as Yup from "yup";

import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import { CustomTextArea } from "components/Forms/CustomTextArea";

import * as path from "constants/routes";
import * as query from "api/mutations";
import { useClickOutside } from "utils/hooks.js";

import externalLink from "assets/external-link.svg";

import "./styles.scss";

const ContactUsSchema = Yup.object().shape({
  description: Yup.string().required("Description is required!"),
});

const Legal = (props) => {
  const [contactUsModal, toggleContactUs] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const innerRef = useRef();

  useClickOutside(innerRef, () => toggleContactUs(false));

  useEffect(() => {
    props.setActiveLink(props.location.pathname);
  }, []);

  const handleSubmit = async (contactUs, values, data) => {
    try {
      contactUs({
        variables: {
          message: values.description,
        },
      }).then((response) => {
        if (response.data.contactUs.success) {
          toggleContactUs(false);
          setSuccess(true);
        } else console.log("errors");
      });
    } catch (error) {}
  };

  const links = [
    {
      id: 1,
      path: path.COOKIE_POLICY,
      name: "Cookie Policy",
    },
    {
      id: 2,
      path: path.TERMS_AND_CONDITIONS,
      name: " Terms and conditions",
    },
    {
      id: 3,
      path: path.FAQ,
      name: "FAQ",
    },
    {
      id: 4,
      path: path.PRIVACY_POLICY,
      name: "privacy policy",
    },
    {
      id: 5,
      path: path.CONTACT_US,
      name: "contact us",
    },
  ];

  return (
    <div className="legal">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            {link.name === "contact us" ? (
              <Link to="#" onClick={() => toggleContactUs(true)}>
                {link.name} <img src={externalLink} alt="" />
              </Link>
            ) : (
              <a href={link.path} target="_blank">
                {link.name}
                <img src={externalLink} alt="" />
              </a>
            )}
          </li>
        ))}
      </ul>
      {contactUsModal && (
        <div ref={innerRef}>
          <AuthSystemFormWrapp
            title="CONTACT US"
            subtitle={
              <>
                Contact us or email us and we promise to get <br /> back to you
                as soon as we can.
              </>
            }
            onClose={() => toggleContactUs(false)}
          >
            <Mutation mutation={query.contactUs}>
              {(contactUs, { loading }) => {
                return (
                  <Formik
                    initialValues={{
                      description: "",
                    }}
                    validationSchema={ContactUsSchema}
                    onSubmit={(form, data) =>
                      handleSubmit(contactUs, form, data)
                    }
                  >
                    {({ values }) => (
                      <Form>
                        <Field
                          name="description"
                          type="text"
                          component={CustomTextArea}
                          placeholder="Got something you want to talk about?"
                          value={values.description}
                          rows="8"
                          maxLength={400}
                        />
                        <Button
                          style={{ background: "#639BE6" }}
                          type="submit"
                          className="d-block mt-2 px-5 py-3 w-100"
                          loading={loading}
                        >
                          Send message
                        </Button>
                      </Form>
                    )}
                  </Formik>
                );
              }}
            </Mutation>
          </AuthSystemFormWrapp>
        </div>
      )}
      {isSuccess && (
        <AuthSystemFormWrapp
          icon={<ion-icon name="checkmark-circle-outline"></ion-icon>}
          title="success"
          subtitle="Your message has been successfully sent"
          withOutIcon
        >
          <Button
            style={{ background: "#639BE6" }}
            className="w-100"
            onClick={() => setSuccess(false)}
          >
            Done
          </Button>
        </AuthSystemFormWrapp>
      )}
    </div>
  );
};

export default Legal;
