import { useState, useEffect } from "react";
import axios from "axios";
import { LocalStore } from "@/store/localstore";

interface Role{
  id:number,
  name:string;
}
interface User {
  email: string;
  id: number;
  organizationId: number;
  roles: Role[]
}
const getUserDataFromToken = async (token: any) => {
  if (!token) return null;
  try {
    console.log(process.env.REACT_APP_BACKEND_API_URL)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}:8000/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const [loading, setLoading] = useState(true); // New state to track loading status
  const [wasLoggedIn, setWasLoggedIn] = useState(false); // New state variable

  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts
    const token = LocalStore.getAccessToken();

    if (token) {
      getUserDataFromToken(token)
        .then((user) => {
          if (user) {
            setUserData(user);
            setLoggedIn(true);
            setWasLoggedIn(true); // Set wasLoggedIn to true when user logs in
          }
          setLoading(false); // Set loading to false after user data is fetched
        })
        .catch((error) => {
          console.error("Error in useAuth useEffect:", error);
          setLoading(false); // Ensure loading is false even if there's an error
        });
    } else {
      setLoading(false); // No token means not loading
    }
  }, []);

  useEffect(() => {
    // Only reload the page if the user was previously logged in
    if (!loggedIn && wasLoggedIn) {
      LocalStore.reload();
    }
  }, [loggedIn, wasLoggedIn]);

  useEffect(() => {
    if (!isClient) return;

    const handleAuthChange = async () => {
      setLoading(true); // Start loading when auth status changes
      const token = LocalStore.getAccessToken();
      setLoggedIn(!!token);
      await getUserDataFromToken(token).then((user) => {
        setUserData(user);
        setLoading(false); // Stop loading once user data is fetched
      });
    };

    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [isClient]); // Re-run when isClient changes
  return { loggedIn, userData, loading };
};

export default useAuth;
