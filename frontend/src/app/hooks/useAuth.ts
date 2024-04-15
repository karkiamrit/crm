"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { jwtDecode } from "jwt-decode";
import { setDocumentLoading } from "@cyntler/react-doc-viewer/dist/esm/store/actions";

interface Role {
  id: number;
  name: string;
}
interface User {
  email: string;
  id: number;
  organizationId: number;
  roles: Role[];
}
const getUserDataFromToken = async (token: any) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts
    const token = LocalStore.getAccessToken();

    if (token) {
      getUserDataFromToken(token)
        .then((user) => {
          if (user) {
            setUserData(user);
            setLoggedIn(true);
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
    setIsClient(true); // Set to true once the component mounts
    const token = LocalStore.getAccessToken();
  
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        console.log("Token expired");
        LocalStore.remove('jwt'); // Remove the expired token
        LocalStore.reload(); // Reload the page
        LocalStore.remove("state");
      } else {
        const timeout = decodedToken.exp * 1000 - Date.now();
        // Add a small delay before setting the timeout
        setTimeout(() => {
          LocalStore.remove('jwt'); // Remove the token
          LocalStore.remove("state");
          LocalStore.reload(); // Reload the page
        }, timeout + 1000); // Add 1 second delay
      }
    }
  }, []); 

  useEffect(() => {
    if (!isClient) return;


    const handleAuthChange = async () => {
      setLoading(true); // Start loading when auth status changes
      const token = LocalStore.getAccessToken();
      setLoggedIn(!!token);
      const user = await getUserDataFromToken(token);
      if (user) {
        setUserData(user);
        setLoading(false); // Stop loading once user data is fetched

      } else {
        console.error("Error in handleAuthChange: user data is null");
      }
    };
  
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [isClient]); // Re-run when isClient changes
  return { loggedIn, userData, loading };
};

export default useAuth;
