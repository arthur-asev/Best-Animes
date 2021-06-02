import React from 'react';
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Categories from './pages/Categories'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import watchAnimes from './pages/Watchanimes';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/categories" component={Categories} />
                <Route exact path="/watchAnimes" component={watchAnimes} />

            </Switch>
        </BrowserRouter>
    );
}

export default Routes;