import React from 'react';
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
import ConfigPage from './pages/ConfigPage';
import CodeDiff from './pages/CodeDiff';
import NewPage from './pages/NewPage';
import CodeDiffDetail from './components/code_diff_detail/CodeDiffDetail';
import UserMapPage from './pages/UserMapPage';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#fff' }}>
        <Switch>
          <Route className="App" path="/" exact component={LoginPage} />
          <Route className="App" path="/repo" exact component={SearchPage} />
          <Route path="/reposearch" component={SearchPage} />
          <Route path="/usermap" component={UserMapPage} />
          <Container style={{ backgroundColor: '#fff' }} maxWidth="lg">
            <Route path="/summary" exact component={SummaryPage} />
            <Route path="/commits" component={CommitPage} />
            <Route path="/table" component={TablePage} />
            <Route path="/batch" component={BatchPage} />
            <Route path="/config" component={ConfigPage} />
            <Route path="/codediff" component={CodeDiff} />
            <Route path="/code_diff_detail" component={CodeDiffDetail} />
          </Container>
        </Switch>
      </div>
      <Route path="/newpage" component={NewPage} />
    </Router>
  );
}

export default App;
