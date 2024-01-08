import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';

export default function BasicTextFields({ title, setPassword, setEmail, handleAction, password }) {
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = () => {
    if (title === 'Register' && password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      handleAction();
    }
  };

  return (
    <div>
      <div className="heading-container">
        <h3>{title} Form</h3>
      </div>

      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="email"
          label="Enter the Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Enter the Password"
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {title === 'Register' && (
          <TextField
            id="confirm-password"
            label="Confirm Password"
            variant="outlined"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
      </Box>

      <Button title={title} handleAction={handleRegister} />
    </div>
  );
}
