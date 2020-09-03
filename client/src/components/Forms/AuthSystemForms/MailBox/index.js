import React from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "semantic-ui-react";

import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";

import { CustomInput } from "../../CustomInput";

import * as query from "api/mutations";

import "./style.scss";

const VerificationForm = (props) => {
  const resendCode = () => {};
  const handleSubmit = () => {
    try {
      // ИГОРЬ ПИШИ ЗДЕСЬ МУТАЦИЮ НА ОТПРАВКУ ЧЕГО-ТО ТАМ,
      // ЧТОБЫ ОБОЙТИСЬ БЕЗ ОБЕРТОК НАД КОМПОНЕНТОМ
      // И WITHROUTER() ТЕБЕ НУ НУЖЕН ПОСКОЛЬКУ ВСЕ ЭТО УЖЕ ЕСТЬ В ПРОПСАХ
      // ЕСЛИ НУЖНО БУДЕТ В ЭТОМ КОМПОНЕНТЕ СДЕЛАТЬ МУТАЦИЮ,
      // ТО ТАКЖЕ ДЕЛАЮ ЧЕРЕЗ КОМОПНЕНТ МУТАТИОН ---
      //   <Mutation mutation={EXAMPLE_MUTATION}>
      //     {(newItem, { data }) => (
      //       <button
      //         onClick={() => newItem({ variables: { type: "Hello World" } })}
      //         type="submit"
      //       >
      //         Add Todo
      //       </button>
      //     )}
      //   </Mutation>;
    } catch (error) {}
  };

  return (
    <Mutation mutation={query.verifyUser}>
      {(verifyUser, { loading }) => {
        return (
          <Formik
            initialValues={{
              code: "",
            }}
            validationSchema={VerificationSchema}
            onSubmit={(form, data) => handleSubmit(verifyUser, form, data)}
          >
            {({ values }) => (
              <Form>
                <Field
                  name="code"
                  type="text"
                  component={CustomInput}
                  placeholder="0000"
                  className="verification-field"
                  value={values.code}
                />
                <Button
                  style={{ background: "#639BE6" }}
                  type="submit"
                  className="d-block m-auto px-5 py-3 w-100"
                  loading={loading}
                >
                  Send
                </Button>
                <div className="text-center mt-3">
                  Did not receive the code?
                  <Link onClick={() => resendCode()}> Resend code</Link>
                </div>
              </Form>
            )}
          </Formik>
        );
      }}
    </Mutation>
  );
};

export default VerificationForm;
