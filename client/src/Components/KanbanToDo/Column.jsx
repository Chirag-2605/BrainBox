import React, { useState, useEffect } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import AddCard from "./AddCard";
import axios from "axios";

const Column = ({ title,boardId, headingColor, cards, columnId, setCards }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [active, setActive] = useState(false);

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() !== "") {
      axios.patch(`http://localhost:8080/api/column/${columnId}`, { title: editedTitle })
        .then(response => {
          console.log('Column title updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating column title:', error);
        });
    }
    setIsEditing(false);
  };

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const handleDragEnd = async(e) => {
    const cardId = e.dataTransfer.getData("cardId");
  
    setActive(false);
    clearHighlights();
  
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
  
    const before = element.dataset.before || "-1";
    console.log(before);
  
    if (before !== cardId) {
      let copy = [...cards];
  
      let cardToTransfer = copy.find((c) => c._id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column_id: columnId }; 
  
      copy = copy.filter((c) => c._id !== cardId);
  
      const moveToBack = before === "-1";
      console.log(cardToTransfer);
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before);
        if (insertAtIndex === -1) return; 
  
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      console.log(cards);
      setCards(copy);
      try {
        
        const response = await axios.put(`http://localhost:8080/api/card/${boardId}`, {cards,cardId,columnId});

       
      } catch (error) {
        // Handle network error
        console.error('Network error:', error.message);
      }
      
      
    }
    
  };
  
    
  

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const clearHighlights = () => {
    setActive(false);
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${columnId}"]`));
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const filteredCards = cards.filter((c) => c.column_id === columnId);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
            className="font-medium text-black"
          />
        ) : (
          <h3
            className={`font-medium ${headingColor}`}
            onClick={() => setIsEditing(true)}
          >
            {editedTitle}
          </h3>
        )}
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors
        ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}
        `}
      >
        {filteredCards.map((c) => (
          <Card
            key={c._id}
            title={c.title} 
            _id={c._id} 
            columnId={columnId}
            handleDragStart={handleDragStart}
            board_id={boardId}
          />
        ))}
        <DropIndicator beforeId={null} column={columnId} />
        <AddCard boardId={boardId} column={columnId} setCards={setCards} />
      </div>
    </div>
  );
};

export default Column;
