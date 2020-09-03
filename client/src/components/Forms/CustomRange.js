import React, { memo } from "react";
import { Range, getTrackBackground } from "react-range";

export const CustomRange = memo(
  ({
    min,
    max,
    step,
    value,
    form,
    field,
    onChange,
    renderThumb,
    colors,
    styles,
    width,
    disabled,
    backgroundColor,
    height,
    ...props
  }) => {
    const defaultStyle = {
      height: "30px",
      width: "30px",
      borderRadius: "50%",
      backgroundColor: backgroundColor || "#333333",
      border: "1px solid #BDBDBD",
      color: "#ffffff",
      fontSize: "12px",
      lineHeight: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      outline: "none"
    };
    return (
      <Range
        values={value}
        step={step}
        min={min}
        disabled={disabled}
        max={max}
        onChange={value =>
          form ? form.setFieldValue(field.name, value) : onChange(value)
        }
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: height || "36px",
              display: "flex",
              width: width || "100%"
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "3px",
                width: "100%",
                borderRadius: "2px",
                background: getTrackBackground({
                  values: value,
                  colors: colors || ["#333333", "#f2f2f2"],
                  min,
                  max
                }),
                alignSelf: "center"
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) =>
          renderThumb ? (
            renderThumb(props)
          ) : (
            <div
              {...props}
              style={{
                ...props.style,
                ...defaultStyle
              }}
            >
              {""}
            </div>
          )
        }
      />
    );
  }
);
