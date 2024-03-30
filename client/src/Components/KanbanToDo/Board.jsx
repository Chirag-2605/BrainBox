import React, { useState,useEffect } from "react";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import { DEFAULT_CARDS } from "../../data";
import axios from "axios";
const Board = ({title}) => {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    // Fetch columns and cards data from backend when component mounts
    axios.get("/api/kanbanTodos")
      .then(response => {
        const data = response.data;
        if (data && data.columns && data.cards) {
          setColumns(data.columns);
          setCards(data.cards);
        } else {
          // Set default columns and cards if no data is returned from the backend
          setColumns([
            { id: 1, title: "Backlog", column: "backlog", headingColor: "text-neutral-500" },
            { id: 2, title: "TODO", column: "todo", headingColor: "text-yellow-200" },
            { id: 3, title: "In progress", column: "doing", headingColor: "text-blue-200" },
            { id: 4, title: "Complete", column: "done", headingColor: "text-emerald-200" }
          ]);
          setCards(DEFAULT_CARDS);
        }
      })
      .catch(error => {
        console.error("Error fetching Kanban data:", error);
        // Set default columns and cards in case of an error
        setColumns([
          { id: 1, title: "Backlog", column: "backlog", headingColor: "text-neutral-500" },
          { id: 2, title: "TODO", column: "todo", headingColor: "text-yellow-200" },
          { id: 3, title: "In progress", column: "doing", headingColor: "text-blue-200" },
          { id: 4, title: "Complete", column: "done", headingColor: "text-emerald-200" }
        ]);
        setCards(DEFAULT_CARDS);
      });
  }, []);
  const addColumn = () => {
    const newColumn = {
      id: Date.now(), // Generating unique id for the column
      title: `Column ${columns.length + 1}`,
      column: `column-${columns.length + 1}`,
      headingColor: getRandomColor()
    };
    
    axios.post("/api/columns", newColumn)
      .then(response => {
        // Update the state with the newly added column received from the backend
        setColumns([...columns, response.data]);
      })
      .catch(error => {
        console.error("Error adding column:", error);
        // Handle error
      });
  };
  
  const deleteColumn = (columnId) => {
    axios.delete(`/api/columns/${columnId}`)
      .then(() => {
        const updatedColumns = columns.filter((column) => column.id !== columnId);
        setColumns(updatedColumns);
        setCards(cards.filter((card) => card.column !== `column-${columnId}`));
      })
      .catch(error => {
        console.error("Error deleting column:", error);
        // Handle error
      });
  };
  
  const handleTitleChange = (columnId, newTitle) => {
    axios.patch(`/api/columns/${columnId}`, { title: newTitle })
      .then(response => {
        setColumns(columns.map(column => {
          if (column.id === columnId) {
            return { ...column, title: response.data.title };
          }
          return column;
        }));
      })
      .catch(error => {
        console.error("Error updating column title:", error);
        // Handle error
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <button
            onClick={addColumn}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Add New Column
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white rounded-lg shadow-md p-4">
            <Column
              title={column.title}
              column={column.column}
              headingColor={column.headingColor}
              cards={cards}
              setCards={setCards}
              onTitleChange={(newTitle) => handleTitleChange(column.id, newTitle)}
            />
            <button
              onClick={() => deleteColumn(column.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block"
            >
              Remove Column
            </button>
          </div>
        ))}
        <BurnBarrel setCards={setCards} />
      </div>
    </div>
  );
};

function getRandomColor() {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-teal-500",
    "text-orange-500",
    "text-cyan-500"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default Board;
