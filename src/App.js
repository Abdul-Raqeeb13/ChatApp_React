import logo from './logo.svg';
import './App.css';
import { Route , Routes } from 'react-router-dom';
import Home from './Components/Home';
import FindFriends from './Components/FindFriends';
import Friends from './Components/Friends';

function App() {  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
         <Route path='/FindFriends' element={<FindFriends/>}></Route> 
        <Route path='/Friends' element={<Friends/>}></Route> 
      </Routes>
    </>
  );
}

export default App;
