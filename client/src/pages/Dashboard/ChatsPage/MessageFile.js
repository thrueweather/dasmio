import React from "react";

const MessageFile = (props) => {
  const fileType = ({ type }) => {
    switch (type) {
      case "application/pdf":
        return "pdf";
        break;
      case "image/jpeg":
        return "img";
        break;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "doc";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "doc";
        break;
      case "application/msword":
        return "doc";
        break;
      case "text/csv":
        return "doc";
        break;
      case "text/plain":
        return "doc";
        break;
      default:
        return "fileIcon";
        break;
    }
  };
  return <div>MessageFile</div>;
};

export default MessageFile;
