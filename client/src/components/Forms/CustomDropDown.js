import React from "react";
import { Dropdown } from "semantic-ui-react";

export const CustomDropDown = React.memo(
  ({ value, onChange, placeholder, options, icon, className, field, form }) => {
    const { touched, errors, setFieldValue } = form;
    const isInValid = touched[field.name] && errors[field.name];
    return (
      <div className="position-relative">
        <Dropdown
          {...field}
          fluid
          selection
          search
          icon={icon}
          placeholder={placeholder}
          value={value}
          onChange={(e, data) =>
            form ? setFieldValue(field.name, data.value) : onChange(data.value)
          }
          options={options}
          className={isInValid ? `error-field ${className}` : className}
        />
        <div
          className="error-field text-left"
          style={{ opacity: isInValid ? 1 : 0, transition: "0.3s all" }}
        >
          {errors[field.name]}
        </div>
      </div>
    );
  }
);
