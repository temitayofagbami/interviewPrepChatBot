
import React, { Component } from "react";
import Header from "./Header";
import Landing from "./pages/Landing";
import Chatbot from './chatbot/Chatbot';

//write App function
const App = () => {
    return (
        <div className = "container">
            <Header />
            <Landing />
           <Chatbot />
        </div>
    )
}
export default App;