import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

// < -COMPONENTS- >
import Login from '../src/components/pages/login/login'
import Menu from '../src/components/pages/protected/menu/menu'
import Test from '../src/components/reuse/test_ly'

function App() {
  return (
    
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/menu" exact component={Menu} />
          <Route path="/test" exact component={Test} />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
