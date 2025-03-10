import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const AddCard = ({boardId,column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column_id: column,
      title: text.trim(),
      _id:uuidv4(),
      board_id:boardId 
    };

    try {
      const response = await axios.post('http://localhost:8080/api/card', newCard);
      console.log('New card created:', response.data);
      setCards((prevCards) => [...prevCards, response.data]);
      setAdding(false);
      setText('');
    } catch (error) {
      console.error('Error creating new card:', error);
    }
    setAdding(false);
    setText(""); 
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-100/20 p-3 text-sm text-neutral-800 placeholder-violet-300 focus:outline-0"
            style={{ resize: "none" }} // Prevent resizing
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-600"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 transition-colors hover:bg-neutral-100"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

export default AddCard;
