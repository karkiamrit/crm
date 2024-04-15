"use client";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { loggedIn, loading } = useAuth(); // Get loggedIn and loading state from useAuth
  const router = useRouter(); // Get router instance

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push('/auth'); // Redirect to auth page if user is not logged in
    }
  }, [loggedIn, loading, router]); // Re-run when loggedIn or loading state changes

  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }
  return <>{children}</>; // Render the wrapped component
};

export default AuthWrapper;
