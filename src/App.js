import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Logout from './Components/Logout';

function App() {
  return (
    <div >
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/dashboard/:name' component={Dashboard} />
        <Route exact path='/logout' component={Logout} />
      </Switch>
    </div >
  );
}

export default App;
