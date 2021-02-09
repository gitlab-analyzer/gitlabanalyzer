import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import './Shared.css';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route path="/" exact component={LoginPage} />
          <Route path="/repo" exact component={SearchPage} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
