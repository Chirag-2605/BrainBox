import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import axios from "axios";

const BurnBarrel = ({ board_id,setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e) => {
    const _id = e.dataTransfer.getData("cardId");
  
    try {
        await axios.delete(`http://localhost:8080/api/card/${board_id}/${_id}`);
        setCards((prevCards) => prevCards.filter((card) => card._id !== _id));
  
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  
    setActive(false);
  };
  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

export default BurnBarrel;
