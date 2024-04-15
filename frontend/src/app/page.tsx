"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from "react";
import useAuth from './hooks/useAuth';

const MainPage = () => {
  const { loggedIn, loading } = useAuth(); // Get loggedIn and loading state from useAuth
  const router = useRouter(); // Get router instance

  useEffect(() => {
    if (!loading) { // Only redirect when not loading
      if (loggedIn) {
        router.push('/dashboard'); // Redirect to dashboard if user is logged in
      } else {
        router.push('/auth'); // Redirect to auth page if user is not logged in
      }
    } 
  }, [loggedIn, loading, router]); // Re-run when loggedIn or loading state changes

  return null; // Don't render anything on this page
};

export default MainPage;