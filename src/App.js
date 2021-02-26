import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GroupList from './GroupList';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
    render() {
        return (
            <CookiesProvider>
                <Router>
                    <Switch>
                        <Route path='/' exact={true} component={Home}/>
                        <Route path='/groups' exact={true} component={GroupList}/>
                    </Switch>
                </Router>
            </CookiesProvider>
        )
    }
}

export default App;