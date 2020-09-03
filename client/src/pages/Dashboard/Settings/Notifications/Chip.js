import React from "react";
import close from "assets/close.svg";

const Chip = ({ category, text, handleRemoveChip, id, type }) => {
  return (
    <div className="chip">
      {(category && (
        <span>
          <strong>{category}</strong>. {text}
        </span>
      )) ||
        text}
      <img src={close} alt="" onClick={() => handleRemoveChip(type, id)} />
    </div>
  );
};

export default Chip;
