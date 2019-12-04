import './index.scss';

import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AppRouter from '../app/router';


class App extends React.Component {

    render() {
        return (
            <Router>
                <Route path="/" component={AppRouter} />
            </Router>
        );
    }
}

export default App;