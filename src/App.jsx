import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RegisterUser from "./pages/auth/RegisterUser.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RegisterUser/>} />
                <Route path="/register" element={<RegisterUser/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
