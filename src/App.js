import './App.css';
import Form from './components/common/Form';
import Home from './components/Home';
import UsernameInput from './components/UsernameInput'; 
import EatingHabits from './components/EatingHabits';
import CarbonFootprintCalculator from './components/carbon';
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { useState } from 'react';
import { signInWithEmailAndPassword,createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from './firebaseconfig';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAction = async (id) => {
    const authentication = getAuth();
    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          navigate('/home');
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
          sessionStorage.setItem('User Email', email); // Save the user's email
        })
        .catch((error) => {
          if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            alert('Please check your email or password, it is invalid!');
          } else {
            alert(error.message)
            console.error('Login error:', error.message);
          }
        });
    }

    if (id === 2) {
      try {
        const response = await createUserWithEmailAndPassword(authentication, email, password);
        navigate(`/register/${email}`);
        sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('User already exists. Please login or use a different email.');
        } else {
          alert(error.message);
          console.error('Registration error:', error.message);
        }
      }
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path='/login'
          element={
            <Form
              title="Login"
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(1)}
            />
          }
        />
        <Route
          path='/register'
          element={
            <Form
              title="Register"
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(2)}
              password={password}
            />
          }
        />
        <Route
          path='/register/:email'
          element={
            <UsernameInput />
          }
        />
        <Route path='/home' element={<Home />} />
        <Route
          path='/carbon-footprint-calc'
          element={<CarbonFootprintCalculator />}
        />
        <Route
          path='/eating-habits'
          element={<EatingHabits />}
        />
      </Routes>
    </div>
  );
}

export default App;
