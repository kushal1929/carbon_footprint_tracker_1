import './App.css';
import Form from './components/common/Form';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    
    <Router>
      <div className="App">
        <>
          <Routes>
            <Route path='/login' element={<Form title="Login"/>} />
            <Route path='/register' element={<Form title="Register"/>} />
          </Routes>
        </>
      </div>
    </Router>
  );
}

export default App;