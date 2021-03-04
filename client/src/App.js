import React from 'react';
import Header from './components/Header';
import Table from './components/Table';
import Batch from './components/Batch';
import Config from './components/Config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import './App.css';
import './Shared.css';
import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import CommitPage from './pages/CommitPage';
import FooterBar from './components/FooterBar';
import TestDrawer from './pages/TestDrawer';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route className="App" path="/" exact component={LoginPage} />
          <Route className="App" path="/repo" exact component={SearchPage} />
          <Container maxWidth="lg">
            <Header />
            <Route path="/test" component={TestDrawer} />
            <Route path="/overview" exact component={OverviewPage} />
            <Route path="/commits" component={CommitPage} />
            <Route path="/table" component={Table} />
            <Route path="/batch" component={Batch} />
            <Route path="/config" component={Config} />
            <FooterBar />
          </Container>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
