import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';

const UsernameInput = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [username, setUsername] = useState('');

  const handleUsernameSubmit = async () => {
    try {
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const userDoc = doc(usersRef, username);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        alert('Username already exists. Please choose another username.');
      } else {
        await setDoc(userDoc, {
          email: email,
          // Other fields related to the user can be added here
        });
        toast.success('Registration successful!');
        navigate('/home');
      }
    } catch (error) {
      alert('Error creating username: ' + error.message);
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${require('../assets/image_1.jpg')})` }}
    >
      <div className="w-full max-w-lg px-8 py-10 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Ecosense!</h1>
          <p className="mt-4 text-gray-500">Please Enter your Username below</p>
        </div>

        <form action="" className="mt-8 space-y-4">
          <div>
            <label htmlFor="Username" className="sr-only">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="contained"
              type="button"
              className="inline-block bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              onClick={handleUsernameSubmit}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameInput;
