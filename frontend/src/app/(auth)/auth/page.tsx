"use client";
import AuthForm from "@/components/auth/Form";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation"; // Make sure to import from 'next/router'
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  const { loggedIn, loading }: { loggedIn: boolean; loading: boolean } = useAuth();

  useEffect(() => {
    if (!loading && loggedIn) {
      router.push("/dashboard"); // Redirect to dashboard if user is logged in
    }
  }, [loggedIn, loading, router]); // Re-run when loggedIn or loading state changes

  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }

  if (!loggedIn) {
    return (
      <div>
        <AuthForm />
      </div>
    );
  }

  // If the user is logged in and the page is not loading, you can return null or a different component
  return null;
};

export default page;