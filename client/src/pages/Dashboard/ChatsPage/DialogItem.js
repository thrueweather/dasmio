import React from "react";

const Dialogitem = ({ room, sender, handleSetRoom }) => {
  return (
    <div className={"dialog-item"} onClick={() => handleSetRoom(room)}>
      <div className="dialog-item-avatar">
        <img
          src={`${process.env.REACT_APP_CONST_BACKEND}/media/${sender.avatar.image}`}
          alt=""
        />
      </div>
      <div className="dialog-item-info">
        <h3>{sender.name || "NAME"}</h3>
        <p>{room.lastMessage ? room.lastMessage.text : "LAST MESSAGE"}</p>
      </div>
      <div className="dialog-item-count">
        <span>10</span>
      </div>
    </div>
  );
};

export default Dialogitem;
