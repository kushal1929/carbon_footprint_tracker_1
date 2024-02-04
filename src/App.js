import './App.css';
import Home from './components/Home';
import UsernameInput from './components/UsernameInput';
import EatingHabits from './components/EatingHabits';
import CarbonFootprintCalculator from './components/carbon';
import CarbonFootprintCalculatorVehicle from './components/vehicle';
import CarbonFootprintCalculatorPublicVehicle from './components/public_transport';
import CarbonFootprintCalculatorExpenditure from './components/expenditure';
import Flight from './components/Flight';


import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from './firebaseconfig';
import Prelogin from './components/Prelogin';
import Login from './components/Login'
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ConsumptionData from './components/ConsumptionData';
import ActionPlan from './components/ActionPlan';
import Quiz from './components/Quiz.js';
import Feedback from './components/Feedback';
import Analytics from './components/Analytics';
import Map from './components/Map.js';

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
            function convertErrorCode(errorCode) {
              // Assuming the error code format is 'auth/{error-message}'
              const parts = errorCode.split('/');
              if (parts.length === 2 && parts[0] === 'auth') {
                const errorMessage = parts[1].replace(/-/g, ' ').charAt(0).toUpperCase() + parts[1].replace(/-/g, ' ').slice(1);
                return errorMessage;
              } else {
                return 'Unknown error';
              }
            }

            //function call to print error message
            const errorMessage = convertErrorCode(error.code);
            alert(errorMessage + '\n' + error.message);
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
        <Route path="/" exact element={<Prelogin />} />

        <Route
          path="/login"
          element={
            <Login
              title="Login"
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(1)}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              title="Register"
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(2)}
              password={password}
            />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register/:email" element={<UsernameInput />} />
        <Route path="/home" element={<Home />} />
        <Route path="/consumption-data" element={<ConsumptionData />} />
        <Route
          path="/carbon-footprint-calc"
          element={<CarbonFootprintCalculator />}
        />
        <Route path="/eating-habits" element={<EatingHabits />} />
        <Route path="/vehicle" element={<CarbonFootprintCalculatorVehicle />} />
        <Route path="/public-vehicle" element={ <CarbonFootprintCalculatorPublicVehicle/>}/>
        <Route path="/expenditure" element={<CarbonFootprintCalculatorExpenditure/>} />
        <Route path="/Flight" element={<Flight />} />
        <Route path="/action-plan" element={<ActionPlan/>}/>
        <Route path="/Quiz" element={<Quiz />} />
        <Route path="/feedback" element={<Feedback />}/>
        <Route path="/Analytics" element={<Analytics />}/>
        <Route path="/Map" element={<Map />}/>
        
      </Routes>
    </div>
  );
}

export default App;
