import React, { useState } from "react";
import { Input, Icon } from "semantic-ui-react";

export const CustomInput = props => {
  const {
    type,
    label,
    icon,
    placeholder,
    onBlur,
    onChange,
    value,
    style,
    defaultValue,
    className,
    maxLength,
    field, // { name, value, onChange, onBlur }
    form // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  } = props;
  const [showPass, togglePass] = useState(false);
  const isInvalid = form && form.touched[field.name] && form.errors[field.name];
  const showFieldType =
    type === "password"
      ? !showPass
        ? "password"
        : showPass
        ? "text"
        : "text"
      : type;
  const withIcon = icon && {
    iconPosition: "left",
    icon
  };
  return (
    <div className="w-100" style={{ padding: "0 0 20px 0" }}>
      {label && (
        <div className="d-flex justify-content-between align-items-center">
          <label className="d-block">{label}</label>
          {type === "password" && (
            <Icon
              name={showPass ? "eye slash" : "eye"}
              size="large"
              className="green"
              onClick={() => togglePass(!showPass)}
            />
          )}
        </div>
      )}
      <Input
        {...field}
        type={showFieldType}
        placeholder={placeholder}
        onChange={e =>
          form ? form.setFieldValue(field.name, e.target.value) : onChange(e)
        }
        value={value}
        defaultValue={defaultValue}
        className={isInvalid ? `error-field ${className}` : className}
        onBlur={onBlur}
        maxLength={maxLength}
        style={{ ...style }}
        {...withIcon}
      />
      <div
        className="error-field text-left"
        style={{ opacity: isInvalid ? 1 : 0, transition: "0.3s all" }}
      >
        {form.errors[field.name]}
      </div>
    </div>
  );
};
