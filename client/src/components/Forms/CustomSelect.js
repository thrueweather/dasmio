import React from "react";
import { Select } from "semantic-ui-react";

export const CustomSelect = React.memo(
  ({ value, onChange, placeholder, options, icon, className, field, form }) => {
    const { touched, errors } = form;
    const isInValid = touched[field.name] && errors[field.name];
    return (
      <div className="position-relative">
        <Select
          {...field}
          value={value}
          placeholder={placeholder}
          options={options}
          onChange={(e, data) =>
            form && form.setFieldValue
              ? form.setFieldValue(field.name, data.value)
              : onChange(data.value)
          }
          className={isInValid ? `error-field ${className}` : className}
          icon={icon}
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
