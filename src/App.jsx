import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RegisterUser from "./pages/auth/RegisterUser.jsx";
import LoginUser from "./pages/auth/LoginUser.jsx";
import RegisterAdmin from "./pages/admin/RegisterAdmin.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginUser/>} />
                <Route path="/login" element={<LoginUser/>} />
                <Route path="/register" element={<RegisterUser/>} />
                <Route path="/admin/register" element={<RegisterAdmin/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
