import React from "react";

const Message = (props) => {
  const imageFormats = [
    "png",
    "jpeg",
    "gif",
    "pjpeg",
    "svg+xml",
    "tiff",
    "vnd.microsoft.icon",
    "vnd.wap.wbmp",
    "webp",
  ];
  return (
    <div className={"message"}>
      <div className={"text"}>{props.text}</div>
      <div className={"time"}>{props.time}</div>
    </div>
  );
};

export default Message;
