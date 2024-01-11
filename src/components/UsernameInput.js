import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsernameInput = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState('');

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
      console.error('Error creating username:', error);
      alert('Error creating username: ' + error.message);
    }
  };

  return (
    <div>
      <h3>Enter Username</h3>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleUsernameSubmit}>Submit</button>
    </div>
  );
};

export default UsernameInput;
