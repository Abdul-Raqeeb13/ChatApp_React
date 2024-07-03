import logo from './logo.svg';
import './App.css';
import { Route , Routes } from 'react-router-dom';
import Home from './Components/Home';
import FindFriends from './Components/FindFriends';
import Friends from './Components/Friends';
import SignUpForm from  './Components/SignUpForm'
import SignInForm from './Components/SignInForm';
import Requests from './Components/Requests';

function App() {  
  return (
    <>
      <Routes>
        <Route path='/' element={<SignUpForm/>}></Route>
        <Route path='/SignInForm' element={<SignInForm/>}></Route>
        <Route path='/Home' element={<Home/>}></Route>
         <Route path='/FindFriends' element={<FindFriends/>}></Route> 
         <Route path='/Requests' element={<Requests/>}></Route> 
        <Route path='/Friends' element={<Friends/>}></Route> 
      </Routes>
    </>
  );
}

export default App;
