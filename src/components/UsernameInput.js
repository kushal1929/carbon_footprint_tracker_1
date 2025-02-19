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
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg text-center">
    <h1 className="text-2xl font-bold sm:text-3xl">Ecolibrium!</h1>

    <p className="mt-4 text-gray-500">
      Please Enter your Username below
    </p>
  </div>

  <form action="" className="mx-auto mb-0 mt-8 max-w-md space-y-4">
    <div>
      <label htmlFor="Username" className="sr-only">Username</label>

      <div className="relative">
        <input
          type="text"
          value={username}
          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
    </div>

    <div className="flex justify-center">
      <Button
        variant='contained'
        type="button"
        className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
        onClick={handleUsernameSubmit}
      >
       Submit
      </Button>
    </div>
  </form>
  </div>
  );
};

export default UsernameInput;
