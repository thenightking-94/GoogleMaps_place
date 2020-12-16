import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Logout from './Components/Logout';
import SearchMap from './Components/SearchMap';
function App() {
  let [force, forcerender] = useState(0);
  useEffect(() => {
    window.addEventListener('resize', doForceRender);

    return () => {
      window.removeEventListener('resize', doForceRender);
    }
  })

  const doForceRender = () => {
    forcerender(force => force + 1);
  }

  return (
    <div >
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/dashboard/:name' component={Dashboard} />
        <Route exact path='/logout' component={Logout} />
        <Route exact path="/search/:word" component={SearchMap} />
      </Switch>
    </div >
  );
}

export default App;
