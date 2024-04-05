import { useEffect } from "react";
import axios from "axios";
import { LocalStore } from "@/store/localstore";

import useAuth from "@/app/hooks/useAuth";
import useOrganizationFormSubmitted from "@/store/organizationFormSubmitted";

const useFetchOrganization = (setOrganization: any) => {
  const { userData } = useAuth();
  const { isOrganizationFormSubmitted, setOrganizationFormSubmitted } =
    useOrganizationFormSubmitted();

  const fetchOrganizationData = async () => {
    if (userData && userData.organizationId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations/${userData.organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${LocalStore.getAccessToken()}`,
            },
          }
        );
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    }
  };

  useEffect(() => {
    fetchOrganizationData();
    
  }, [userData, setOrganization, fetchOrganizationData]);

  useEffect(() => {
    if (isOrganizationFormSubmitted) {
      fetchOrganizationData();
      
      setOrganizationFormSubmitted(false);
    }
  }, [isOrganizationFormSubmitted, setOrganizationFormSubmitted, fetchOrganizationData]);

  // Return a function that can be called to trigger fetching the organization data
  return fetchOrganizationData;
};

export default useFetchOrganization;
