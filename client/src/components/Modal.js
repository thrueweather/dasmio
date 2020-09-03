import React from "react";
import { Modal } from "semantic-ui-react";

const ModalShorthand = ({
  isOpen,
  toggleModal,
  trigger,
  content,
  customStyles,
  className,
}) => {
  const onClose = () => toggleModal(false);
  return (
    <Modal
      open={isOpen}
      dimmer="blurring"
      trigger={trigger}
      className={className}
      style={customStyles || { height: 50 }}
      onClose={onClose}
      centered={false}
    >
      <Modal.Content>{content}</Modal.Content>
    </Modal>
  );
};

export default ModalShorthand;
