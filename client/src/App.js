import React from 'react';
import Header from './components/Header';
import Overview from './components/Overview';
import Code from './components/Code';
import Table from './components/Table';
import Batch from './components/Batch';
import Config from './components/Config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import './App.css';
import './Shared.css';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import CommitPage from './pages/CommitPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route className="App" path="/" exact component={LoginPage} />
          <Route className="App" path="/repo" exact component={SearchPage} />
          <Container maxWidth="md">
            <Header />
            <Route path="/overview" exact component={Overview} />
            <Route path="/commits" component={Code} />
            <Route path="/table" component={Table} />
            <Route path="/batch" component={Batch} />
            <Route path="/config" component={Config} />
            <Route path="/commits" component={CommitPage} />
          </Container>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
