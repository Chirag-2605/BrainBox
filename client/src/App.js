import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Landing from './Components/Landing';
import Calendar from './Components/Calendar/Calendar';
import Board from './Components/KanbanToDo/Board';
import Document from './Components/Documents/document';
import TextEditor from './Components/Documents/textEditor';

function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {user && <Route path='/' element={<Landing/>}></Route>}
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<Navigate replace to='/landing' />}></Route>
      <Route path='/landing' element={<Landing />}></Route>
      <Route path='/home' element={<Home></Home>}></Route>
      <Route path='/calendar' element={<Calendar></Calendar>}></Route>
      <Route path='/board' element={<Board></Board>}></Route>
      {/* document */}
      <Route path='/documents' element={<Document></Document>}></Route>
      <Route path='/documents/:name/:id' element={<TextEditor />}></Route>
    </Routes>
  );
}

export default App;
