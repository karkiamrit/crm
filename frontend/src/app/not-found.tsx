"use client"
import { Button } from '@/components/ui/button';
import { LocalStore } from '@/store/localstore';
import axios from 'axios';
import React from 'react';

const handleClick = async () => {
  console.log(LocalStore.getAccessToken())
  try {
    LocalStore.remove('jwt');
    const response = await axios.post("http://localhost:8000/auth/logout", {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
    }
    ); 
    console.log('here')
    
    console.log("there")
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

const NotFoundPage: React.FC = () => {
  return (
    <div className="container">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button onClick={handleClick}>Logout</Button> {/* Moved onClick to Button component */}
    </div>
  );
};

export default NotFoundPage;
