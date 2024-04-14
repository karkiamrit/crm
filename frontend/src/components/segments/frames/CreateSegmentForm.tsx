// import useAuth from "@/app/hooks/useAuth";
// import { LocalStore } from "@/store/localstore";
// import axios from "axios";
// import React from "react";

// type Props = {};
// interface Range {
//   property: string;
//   lower: string;
//   upper: string;
// }
// const CreateSegmentForm = (props: Props) => {
//   const { userData } = useAuth();

//   //   const fetchLeadsFromApi = async (url: string, appliedFilter: Range[]) => {
//   //     const rangeFields = ["name", "email", "address", "source", "priority"];
//   //     const range = appliedFilter
//   //       .filter((f) => rangeFields.includes(f.property))
//   //       .map(
//   //         (f) =>
//   //           `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
//   //       )
//   //       .join(",");
//   //     const where = appliedFilter
//   //       .filter((f) => !rangeFields.includes(f.property))
//   //       .reduce((acc, f) => ({ ...acc, [f.property]: f.lower }), {});
//   //     const response = await axios.get(url, {
//   //       headers: {
//   //         Authorization: `Bearer ${LocalStore.getAccessToken()}`,
//   //       },
//   //     });
//   //     const data = response.data.data;
//   //     return Array.isArray(data) ? data : [];
//   //   };

//   const fetchLeadsFromApi = async (url: string, appliedFilter: Range[]) => {
//     const rangeFields = ["name", "email", "address", "source", "priority"];
//     const statusFilter = appliedFilter.find((f) => f.property === "status");

//     const queryParams: Record<string, string> = {};

//     if (statusFilter) {
//       queryParams.status = statusFilter.lower; // Assuming the status filter has a lower bound
//     }

//     const range = appliedFilter
//       .filter((f) => rangeFields.includes(f.property))
//       .map(
//         (f) =>
//           `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
//       )
//       .join(",");

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${LocalStore.getAccessToken()}`,
//       },
//       params: {
//         ...queryParams,
//         range: `[${range}]`,
//       },
//     });

//     const data = response.data.data;
//     return Array.isArray(data) ? data : [];
//   };

//   const fetchLeads = async (appliedFilter: Range[]) => {
//     try {
//       const hasAgentRoleWithoutAdmin = userData?.roles.reduce(
//         (acc, role) => {
//           if (role.name === "Admin")
//             return { isAdmin: true, isAgent: acc.isAgent };
//           if (role.name === "Agent")
//             return { isAdmin: acc.isAdmin, isAgent: true };
//           return acc;
//         },
//         { isAdmin: false, isAgent: false }
//       );
//       if (
//         hasAgentRoleWithoutAdmin?.isAgent &&
//         !hasAgentRoleWithoutAdmin?.isAdmin
//       ) {
//         return await fetchLeadsFromApi(
//           `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/myleads`,
//           appliedFilter
//         );
//       } else {
//         return await fetchLeadsFromApi(
//           `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads`,
//           appliedFilter
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       return [];
//     }
//   };

//   const handleSubmit = async (appliedFilter: Range[]) => {
//     try {
//       // Fetch leads with applied filters
//       const leads = await fetchLeads(appliedFilter);

//       // Extract lead IDs from the response
//       const leadIds = leads.map((lead: any) => lead.id);

//       // Create segment with the retrieved lead IDs
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/segments`,
//         { leads: leadIds, name: "My Segment", description: "My leads" },
//         {
//           headers: {
//             Authorization: `Bearer ${LocalStore.getAccessToken()}`,
//           },
//         }
//       );

//       if (response.status >= 200 && response.status <= 300) {
//         // Handle success
//         console.log("Segment created successfully.");
//       } else {
//         throw new Error("An error occurred while creating the segment.");
//       }
//     } catch (err: any) {
//       // Handle error
//       console.error("An error occurred while creating the segment:", err);
//     }
//   };
//   return(<></>)
// };

// export default CreateSegmentForm;
import useAuth from "@/app/hooks/useAuth";
import { LocalStore } from "@/store/localstore";
import axios from "axios";
import React, { useState } from "react";

type Props = {};

enum LeadsStatus {
  INITIAL = "INITIAL",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

const CreateSegmentForm = (props: Props) => {
  const { userData } = useAuth();
  const [filters, setFilters] = useState<Range[]>([
    { property: "", lower: "", upper: "" },
  ]);

  const handleAddFilter = () => {
    setFilters([...filters, { property: "", lower: "", upper: "" }]);
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  interface Range {
    property: string;
    lower: string;
    upper: string;
  }

  const handleFilterChange = (
    index: number,
    key: keyof Range, // Use keyof Range to restrict key to known keys of Range
    value: string
  ) => {
    const updatedFilters = [...filters];
    updatedFilters[index][key] = value;
    setFilters(updatedFilters);
  };
  

  const fetchLeadsFromApi = async (
    url: string,
    appliedFilter: Range[]
  ) => {
    const queryParams: Record<string, string> = {};
  
    const statusFilter = appliedFilter.find(
      (f) => f.property === "status"
    );
  
    if (statusFilter) {
      queryParams.status = statusFilter.lower;
    }
  
    const rangeFields = ["name", "email", "address", "source", "priority"];
    const rangeFilters = appliedFilter.filter(
      (f) => rangeFields.includes(f.property)
    );
  
    if (rangeFilters.length > 0) {
      const range = rangeFilters
        .map(
          (f) =>
            `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
        )
        .join(",");
      queryParams.range = `[${range}]`;
    }
  
    console.log("Query Params:", queryParams);
  
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
      params: queryParams,
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
      const url = hasAgentRoleWithoutAdmin?.isAgent &&
        !hasAgentRoleWithoutAdmin?.isAdmin
        ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/myleads`
        : `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads`;
      
      return await fetchLeadsFromApi(url, appliedFilter);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    try {
      const leads = await fetchLeads(filters);
      const leadIds = leads.map((lead: any) => lead.id);
      console.log(leadIds)
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
        console.log("Segment created successfully.");
      } else {
        throw new Error("An error occurred while creating the segment.");
      }
    } catch (err: any) {
      console.error("An error occurred while creating the segment:", err);
    }
  };

  return (
    <div>
      {/* Render filter fields here */}
      {filters.map((filter, index) => (
        <div key={index}>
          <select
            value={filter.property}
            onChange={(e) =>
              handleFilterChange(index, "property", e.target.value)
            }
          >
            <option value="">Select Property</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="source">Source</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
          {filter.property === "status" ? (
            <select
              value={filter.lower}
              onChange={(e) =>
                handleFilterChange(index, "lower", e.target.value)
              }
            >
              <option value="">Select Status</option>
              {Object.values(LeadsStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                value={filter.lower}
                onChange={(e) =>
                  handleFilterChange(index, "lower", e.target.value)
                }
                placeholder="Lower"
              />
              <input
                type="text"
                value={filter.upper}
                onChange={(e) =>
                  handleFilterChange(index, "upper", e.target.value)
                }
                placeholder="Upper"
              />
            </>
          )}
          <button onClick={() => handleRemoveFilter(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddFilter}>Add Filter</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CreateSegmentForm;
