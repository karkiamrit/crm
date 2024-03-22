import { LocalStore } from "@/store/localstore";
import axios from "axios";
import { useState, useEffect } from "react";

const getUserDataFromToken = async (): Promise<any | null> => {
  try {
    const response = await axios.get("http://localhost:8000/users/me", {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const isLoggedIn = (): boolean => {
  const token = LocalStore.getAccessToken();
  return token !== null;
};

const useAuth = (): { loggedIn: boolean; userData: any | null } => {
  const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserDataFromToken();
        if (user) {
          setUserData(user);
          setLoggedIn(true);
        } else {
          setUserData(null);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error in useAuth useEffect:", error);
        setUserData(null);
        setLoggedIn(false);
      }
    };

    fetchData(); // Call fetchData only once when the component mounts

    const handleAuthChange = () => {
      setLoggedIn(isLoggedIn());
      fetchData();
    };

    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []); // Use an empty dependency array to run the effect only once

  return { loggedIn, userData };
};

export default useAuth;
