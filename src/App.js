import './App.css';
import Form from './components/common/Form';
import Home from './components/Home';
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

  const handleAction = (id) => {
    const authentication = getAuth();
    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          navigate('/home');
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
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
          alert(errorMessage+'\n'+error.message);
          }
        });
    }

    if (id === 2) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          navigate('/home');
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
        })
        .catch((error) => {

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
        alert(errorMessage+'\n'+error.message);
        
        });
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
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
