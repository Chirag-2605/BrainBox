import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Landing from './Components/Landing';


function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {user && <Route path='/' element={<Landing/>}></Route>}
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<Navigate replace to='/landing' />}></Route>
      <Route path='/landing' element={<Landing />}></Route>
    </Routes>
  );
}

export default App;
