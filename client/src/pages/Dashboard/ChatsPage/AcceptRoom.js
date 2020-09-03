import React from "react";
import * as mutate from "../../../api/mutations";

import { Button } from "semantic-ui-react";

import { Mutation } from "react-apollo";
// APPROVE_ROOM
const AcceptRoom = (props) => {
  const handleApproveRoom = async (mutate, value) => {
    try {
      const response = await mutate({
        variables: {
          accept: value,
          roomId: props.room.id,
        },
      });
      console.log(response);
      // if (response.data.APPROVE_ROOM.success) {
      // }
    } catch (error) {
      // setState({ ...state, errorModal: true });
    }
  };

  return (
    <div className={"accept-room"}>
      <div className={"info"}>
        <h3>Accept message from Bryan Dominic?</h3>
        <p>
          If you reply Bryan Dominic will be able to call you and see
          information like your Active Status and when you`ve read messsages.
        </p>
      </div>
      <div className={"actions"}>
        <Mutation mutation={mutate.APPROVE_ROOM}>
          {(APPROVE_ROOM, { data, loading }) => (
            <Button
              type="submit"
              className={"leave"}
              loading={loading}
              onClick={() => handleApproveRoom(APPROVE_ROOM, true)}
            >
              Leave chat
            </Button>
          )}
        </Mutation>
        <Mutation mutation={mutate.APPROVE_ROOM}>
          {(APPROVE_ROOM, { data, loading }) => (
            <Button
              type="submit"
              className={"continue"}
              loading={loading}
              onClick={() => handleApproveRoom(APPROVE_ROOM, false)}
            >
              Continue chat
            </Button>
          )}
        </Mutation>
      </div>
    </div>
  );
};

export default AcceptRoom;
