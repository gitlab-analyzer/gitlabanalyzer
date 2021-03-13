import React from 'react';
import Header from './components/Header';
import Batch from './components/Batch';
import Config from './components/Config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import './App.css';
import './Shared.css';
import SummaryPage from './pages/SummaryPage';
import BatchPage from './pages/BatchPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import CommitPage from './pages/CommitPage';
import TablePage from './pages/TablePage';
import FooterBar from './components/FooterBar';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route className="App" path="/" exact component={LoginPage} />
          <Route className="App" path="/repo" exact component={SearchPage} />
          <Route path="/reposearch" component={SearchPage} />
          <Container maxWidth="lg">
            <Header />
            <Route path="/summary" exact component={SummaryPage} />
            <Route path="/commits" component={CommitPage} />
            <Route path="/table" component={TablePage} />
            <Route path="/batch" component={BatchPage} />
            <Route path="/config" component={Config} />
            <FooterBar />
          </Container>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
