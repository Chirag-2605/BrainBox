import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import { DEFAULT_CARDS } from "../../data";
import axios from "axios";

const Board = () => {
  const { id: boardId, title: boardTitle } = useParams();
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);

  const createNewBoard = async () => {
    const defaultColumns = [
      { _id: uuidv4(), title: "Backlog", headingColor: "text-neutral-500", board_id: boardId },
      { _id: uuidv4(), title: "TODO", headingColor: "text-yellow-200", board_id: boardId },
      { _id: uuidv4(), title: "In progress", headingColor: "text-blue-200", board_id: boardId },
      { _id: uuidv4(), title: "Complete", headingColor: "text-emerald-200", board_id: boardId }
    ];
    const DEFAULT_CARDS = [
      { _id: uuidv4(), title: "Plan weekend getaway", column_id: defaultColumns[0]._id },
      { _id: uuidv4(), title: "Create grocery shopping list", column_id: defaultColumns[0]._id },
      { _id: uuidv4(), title: "Read new book", column_id: defaultColumns[0]._id },
      { _id: uuidv4(), title: "Watch movie with family", column_id: defaultColumns[0]._id },
      // TODO
      { _id: uuidv4(), title: "Complete online course", column_id: defaultColumns[1]._id },
      { _id: uuidv4(), title: "Start home workout routine", column_id: defaultColumns[1]._id },
      { _id: uuidv4(), title: "Learn to cook a new dish", column_id: defaultColumns[1]._id },
      // DOING
      { _id: uuidv4(), title: "Work on personal project", column_id: defaultColumns[2]._id },
      { _id: uuidv4(), title: "Practice musical instrument", column_id: defaultColumns[2]._id },
      // DONE
      { _id: uuidv4(), title: "Finish painting", column_id: defaultColumns[3]._id },
      { _id: uuidv4(), title: "Organize closet", column_id: defaultColumns[3]._id }
    ];
    
    const newBoard = {
      _id: boardId,
      title: boardTitle, 
      columns: defaultColumns,
      cards: DEFAULT_CARDS
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/kanban-todos/${boardId}`, newBoard);
      setColumns(response.data.columns);
      setCards(response.data.cards);
      
      console.log("New board created:", response.data);
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };

  const fetchKanban = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/kanban-todos/${boardId}`);
      const data = response.data;

      if (data) {
        const columnsData = data.columns;
        const cardsData = data.cards || DEFAULT_CARDS;
        setColumns(columnsData);
        setCards(cardsData);
    
      } else {
        console.log("Kanban Todo not found");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        createNewBoard();
      }
    }
  };

  useEffect(() => {
    fetchKanban();
  }, []);

  const addColumn = () => {
    const newColumn = {
      _id: uuidv4(),
      title: `Column ${columns.length + 1}`,
      headingColor: getRandomColor(),
      board_id: boardId
    };
    async function update(){
      try{
      const response=await axios.post("http://localhost:8080/api/column/", newColumn);
      console.log(response);
      if(response){
        
        setColumns(prevColumns => [...prevColumns, response.data]);
      }
     }
     catch(error){
      console.log("Error adding column:", error);
     }

    }
    update();
  };

  const deleteColumn = (columnId) => {
    axios.delete(`http://localhost:8080/api/column/${columnId}`)
      .then(() => {
        setColumns(prevColumns => prevColumns.filter((column) => column._id !== columnId));
        setCards(prevCards => prevCards.filter((card) => card.column_id !== columnId));
      })
      .catch(error => {
        console.error("Error deleting column:", error);
      });
  };
  
  const handleTitleChange = (columnId, newTitle) => {
    axios.patch(`http://localhost:8080/api/column/${columnId}`, { title: newTitle })
      .then(response => {
        setColumns(columns.map(column => {
          if (column._id === columnId) {
            return { ...column, title: response.data.title };
          }
          return column;
        }));
      })
      .catch(error => {
        console.error("Error updating column title:", error);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {boardTitle}
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
          <div key={column._id} className="bg-white rounded-lg shadow-md p-4">
            <Column
              title={column.title}
              boardId={column.board_id}
              headingColor={column.headingColor}
              columnId={column._id} 
              cards={cards}
              setCards={setCards}
              onTitleChange={(newTitle) => handleTitleChange(column._id, newTitle)}
            />
            <button
              onClick={() => deleteColumn(column._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block"
            >
              Remove Column
            </button>
          </div>
        ))}
        <BurnBarrel board_id={boardId} setCards={setCards} />
      </div>
    </div>
  );
};

// Function to get random colors
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
    "text-orange",
    "text-cyan-500"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default Board;
