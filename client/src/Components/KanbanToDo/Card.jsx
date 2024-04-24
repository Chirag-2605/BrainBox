import React from "react";
import { motion } from "framer-motion";
import DropIndicator from "./DropIndicator";

const Card = ({ title, _id, columnId, handleDragStart ,board_id}) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={columnId} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, _id, column_id: columnId, board_id })}
        className="text-black cursor-grab rounded border border-gray-300 bg-gray-100 p-3 active:cursor-grabbing"
      >
        {title}
      </motion.div>
    </>
  );
};

export default Card;
