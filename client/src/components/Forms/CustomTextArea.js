import React from "react";
import { Form, TextArea } from "semantic-ui-react";

export const CustomTextArea = props => {
  const {
    type,
    label,
    placeholder,
    style,
    rows,
    maxLength,
    field, // { name, value, onChange, onBlur }
    form: { touched, errors } // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  } = props;
  const isInValid = touched[field.name] && errors[field.name];
  return (
    <div className="pb-3 w-100">
      {label && (
        <div className="d-flex justify-content-between align-items-center">
          <label className="d-block">{label}</label>
        </div>
      )}
      <Form>
        <TextArea
          {...field}
          type={type}
          placeholder={placeholder}
          className={isInValid && "error-field"}
          style={style}
          rows={rows}
          maxLength={maxLength}
        />
        <div className="textarea-limit">{`${field.value.length}/${maxLength}`}</div>
      </Form>
      {isInValid && (
        <div className="error-field text-left">{errors[field.name]}</div>
      )}
    </div>
  );
};
