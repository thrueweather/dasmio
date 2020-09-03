import React, { useState } from "react";

import ChatList from "./ChatList";
import Room from "./Room";

const ChatPage = ({
  userId,
  profiles,
  rooms,
  room,
  categoryId,
  setCategoryId,
}) => {
  const [activeRoom, setActiveRoom] = useState(room);
  const handleSetRoom = (val) => setActiveRoom(val);
  return (
    <div className={"chats-page"}>
      <ChatList
        userId={userId}
        profiles={profiles}
        data={rooms}
        handleSetRoom={handleSetRoom}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />
      <Room
        categoryId={categoryId}
        userId={profiles[0].id}
        sender={
          activeRoom
            ? activeRoom.users.filter((item) => item.id !== userId)[0]
            : false
        }
        room={activeRoom}
      />
    </div>
  );
};

export default ChatPage;
