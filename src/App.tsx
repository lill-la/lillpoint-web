import React from 'react';
import './App.css';
import {Route, Routes} from "react-router";
import Home from "./pages/Home";
import Sign from "./pages/Sign";
import Read from "./pages/Read";
import KeyGen from "./pages/KeyGen";
import logo from "./logo.png";

function App() {
  return (
    <div className="App flex flex-col justify-center">
      <div className='flex flex-col items-center justify-center mb-8'>
        <img src={logo} className="h-20 pointer-events-none" alt="logo"/>
        <p className='text-2xl text-center'>
          lill POINT
        </p>
      </div>
      <Routes>
        <Route path="*" element={Home()}/>
        <Route path='/v1/sign' element={Sign()}/>
        <Route path='/v1/r' element={Read()}/>
        <Route path='/v1/keygen' element={KeyGen()}/>
      </Routes>
    </div>
  );
}

export default App;
