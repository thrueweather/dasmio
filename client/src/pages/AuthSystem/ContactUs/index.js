import React from "react";

import AuthSystemWrapp from "../index";
import AuthSystemFormWrapp from "components/Forms/AuthSystemForms/index";
import ContactUsForm from "components/Forms/AuthSystemForms/ContactUs";

const ContactUs = (props) => {
  return (
    <AuthSystemWrapp>
      <AuthSystemFormWrapp
        title="contact us"
        subtitle="Contact us and we promise to get back to you as soon as we can."
        {...props}
      >
        <ContactUsForm {...props} />
      </AuthSystemFormWrapp>
    </AuthSystemWrapp>
  );
};

export default ContactUs;
