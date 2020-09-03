import React from "react";

import { Query } from "react-apollo";

import Dialogitem from "./DialogItem";
import * as query from "api/queries";

const Category = ({ messageCount, item, active, setCategoryId, id }) => {
  return (
    <div className={"category" + active} onClick={() => setCategoryId(id)}>
      <span className={"category-name"}>{item}</span>
      <div className={"counter"}>
        <span>{messageCount > 9 ? "9+" : messageCount}</span>
      </div>
    </div>
  );
};
// waitingForApprove;
const ChatList = (props) => {
  const chatListFilter = ["Matches", "Listings", "Chats"];
  return (
    <div className={"chat-list"}>
      <div className="filter">
        {chatListFilter.map((item, id) => (
          <Category
            key={id}
            item={item}
            active={id === props.categoryId ? " active" : ""}
            id={id}
            messageCount={props.data.length}
            categoryId={props.categoryId}
            setCategoryId={props.setCategoryId}
          />
        ))}
      </div>
      <div className="chat-list-container">
        {props.data.map((item) => (
          <Dialogitem
            key={item.id}
            userId={props.userId}
            lastMessage={item.lastMessage}
            sender={
              item.users.filter((elem) => elem.id != props.profiles[0].id)[0]
            }
            handleSetRoom={props.handleSetRoom}
            room={item}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
