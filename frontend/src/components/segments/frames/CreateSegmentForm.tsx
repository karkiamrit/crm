import useAuth from "@/app/hooks/useAuth";
import { LocalStore } from "@/store/localstore";
import axios from "axios";
import React from "react";

type Props = {};
interface Range {
  property: string;
  lower: string;
  upper: string;
}
const CreateSegmentForm = (props: Props) => {
  const { userData } = useAuth();

//   const fetchLeadsFromApi = async (url: string, appliedFilter: Range[]) => {
//     const rangeFields = ["name", "email", "address", "source", "priority"]; 
//     const range = appliedFilter
//       .filter((f) => rangeFields.includes(f.property))
//       .map(
//         (f) =>
//           `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
//       )
//       .join(",");
//     const where = appliedFilter
//       .filter((f) => !rangeFields.includes(f.property))
//       .reduce((acc, f) => ({ ...acc, [f.property]: f.lower }), {});
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${LocalStore.getAccessToken()}`,
//       },
//     });
//     const data = response.data.data;
//     return Array.isArray(data) ? data : [];
//   };

const fetchLeadsFromApi = async (url: string, appliedFilter: Range[]) => {
    const rangeFields = ["name", "email", "address", "source", "priority"]; 
    const statusFilter = appliedFilter.find((f) => f.property === "status");
  
    const queryParams: Record<string, string> = {};
  
    if (statusFilter) {
      queryParams.status = statusFilter.lower; // Assuming the status filter has a lower bound
    }
  
    const range = appliedFilter
      .filter((f) => rangeFields.includes(f.property))
      .map(
        (f) =>
          `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
      )
      .join(",");
  
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
      params: {
        ...queryParams,
        range: `[${range}]`,
      },
    });
  
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  };
  

  const fetchLeads = async (appliedFilter: Range[]) => {
    try {
      const hasAgentRoleWithoutAdmin = userData?.roles.reduce(
        (acc, role) => {
          if (role.name === "Admin")
            return { isAdmin: true, isAgent: acc.isAgent };
          if (role.name === "Agent")
            return { isAdmin: acc.isAdmin, isAgent: true };
          return acc;
        },
        { isAdmin: false, isAgent: false }
      );
      if (
        hasAgentRoleWithoutAdmin?.isAgent &&
        !hasAgentRoleWithoutAdmin?.isAdmin
      ) {
        return await fetchLeadsFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/myleads`,
          appliedFilter
        );
      } else {
        return await fetchLeadsFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads`,
          appliedFilter
        );
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
  };

  const handleSubmit = async (appliedFilter: Range[]) => {
    try {
      // Fetch leads with applied filters
      const leads = await fetchLeads(appliedFilter);

      // Extract lead IDs from the response
      const leadIds = leads.map((lead: any) => lead.id);

      // Create segment with the retrieved lead IDs
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/segments`,
        { leads: leadIds, name: "My Segment", description: "My leads" },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );

      if (response.status >= 200 && response.status <= 300) {
        // Handle success
        console.log("Segment created successfully.");
      } else {
        throw new Error("An error occurred while creating the segment.");
      }
    } catch (err: any) {
      // Handle error
      console.error("An error occurred while creating the segment:", err);
    }
  };
  return <div>CreateSegmentForm</div>;
};

export default CreateSegmentForm;
