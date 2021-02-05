import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Overview from './components/Overview'
import Code from './components/Code'
import Table from './components/Table'
import Batch from './components/Batch'
import Config from './components/Config'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import { Container, Typography } from '@material-ui/core'

function App() {
  const [placeholder, setPlaceholder] = useState('Hi');

  useEffect(() => {
    fetch('/hello').then(res => res.json()).then(data => {
      setPlaceholder(data.result);
    });
  }, []);

  return (
    <Router>
    <div className="App">
    <Container maxWidth="md">
      <Header />
      <Switch>
        <Route exact path="/overview" component={Overview} />
        <Route path="/code" component={Code} />
        <Route path="/table" component={Table} />
        <Route path="/batch" component={Batch} />
        <Route path="/config" component={Config} />
        <Redirect exact from="/" to="/overview" />
      </Switch>
      <h3>Flask: {placeholder}</h3>
</Container>
    </div>
    </Router>
  );
}

export default App;
