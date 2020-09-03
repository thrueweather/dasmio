import React, { useEffect } from "react";

import Message from "./Message";
import AcceptMessage from "./AcceptMessage";

import * as query from "api/queries";

export const MessagesContainer = ({ room, sender, fetchMore }) => {
  const messagesEndRef = React.createRef();

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    };
    if (room.messages.length) {
      scrollToBottom();
    }
  }, [room.messages]);

  const handleScroll = ({ currentTarget }, onLoadMore) => {
    if (!currentTarget.scrollTop) {
      onLoadMore();
    }
  };

  return (
    <div
      className={"messages"}
      onScroll={(e) =>
        handleScroll(e, () => {
          fetchMore({
            variables: {
              id: room.id,
              first: 5,
              skip: room.messages.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                room: {
                  ...prev.room,
                  messages: [
                    ...prev.room.messages,
                    ...fetchMoreResult.room.messages,
                  ],
                },
              };
            },
          });
        })
      }
    >
      {room.waitingForApprove ? (
        <AcceptMessage
          sender={sender}
          post={room.post}
          receiverPost={room.receiverPost}
        />
      ) : room.messages.length ? (
        <>
          {room.messages.map((message) => (
            <Message {...message} key={message.id} />
          ))}
        </>
      ) : (
        <p>No messages</p>
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};
