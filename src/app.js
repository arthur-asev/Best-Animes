import React from 'react';
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Categories from './pages/Categories'
import {Route, Routes} from 'react-router'
import WatchAnimes from './pages/Watchanimes';

const App = () => {
    return (
      
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/register" element={<Register/>} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/categories" element={<Categories/>} />
                <Route exact path="/watchAnimes" element={<WatchAnimes/>} />

            </Routes>

    );
}

export default App;