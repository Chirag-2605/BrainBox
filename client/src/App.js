import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Landing from './Components/Landing';
import Calendar from './Components/Calendar/Calendar';
import Board from './Components/KanbanToDo/Board';
import BoardLanding from './Components/KanbanToDo/BoardLanding'
import Document from './Components/Documents/document';
import TextEditor from './Components/Documents/textEditor';
import {jwtDecode} from 'jwt-decode';
import { useState, useEffect, Component } from 'react';

function App() {
    const user = localStorage.getItem("token");
    const [userId, setUserId] = useState(null);
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId || decodedToken._id;
                setUserId(userId);
            } catch(err) {
                console.log("error while fetching token: ", err)
            }
        }
    })
    return (
        <Routes>

        {/* Landing Route */}
        {user && <Route path='/' element={<Landing/>}></Route>}
        <Route path='/' element={<Navigate replace to='/landing' />}></Route>
        <Route path='/landing' element={<Landing />}></Route>

        {/* Signup Route */}
        <Route path='/signup' element={<Signup />}></Route>

        {/* Login Route */}
        <Route path='/login' element={<Login />}></Route>
        
        {/* Home Route */}
        <Route
            path='/home'
            element={userId ? <Navigate replace to={`/home/${userId}`} /> : <Home />}
        />
        <Route path='/home/:id' element={<Home></Home>}></Route>

        {/* Calendar Route */}
        <Route
            path='/calendar'
            element={userId ? <Navigate replace to={`/calendar/${userId}`} /> : <Home />}
        />
        <Route path='/calendar/:userId' element={<Calendar></Calendar>}></Route>

        {/* To-do Route */}
        <Route
            path='/board'
            element={userId ? <Navigate replace to={`/board/${userId}`} /> : <Home />}
        />
        <Route path='/board/:userId' element={<BoardLanding/>}/>
        <Route path='/board/:userId/:title/:id' element={<Board></Board>}></Route>

        {/* Document Route */}
        <Route
            path='/documents'
            element={userId ? <Navigate replace to={`/documents/${userId}`} /> : <Home />}
        />

        <Route path='/documents/:userId' element={<Document></Document>}></Route>
        <Route path='/documents/:userId/:name/:id' element={<TextEditor />}></Route>
        <Route path='/documents/:userId/:name/:id/room' element={<TextEditor />}></Route>
        </Routes>
    );
    }

export default App;
