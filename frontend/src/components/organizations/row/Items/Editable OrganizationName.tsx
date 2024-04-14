import React, { useState } from "react";
import axios from "axios";
import Icon from "@/components/Iconlist";
import { LocalStore } from "@/store/localstore";
import { Organization } from "../../Organization";
import useAuth from "@/app/hooks/useAuth";

interface EditableOrganizationNameProps {
  organization: Organization;
  hasAdminRole: boolean | undefined;
}

const EditableOrganizationName: React.FC<EditableOrganizationNameProps> = ({
  organization,
  hasAdminRole
}) => {
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(organization.name);
  const [isIconHovered, setIsIconHovered] = useState(false);
  

  const handleNameUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations/${organization.id}`,
        { ...organization, name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );
      if (response.data) {
        // Update organization data with the response
        // (assuming the response contains the updated organization data)
        setUpdatedName(response.data.name);
      }
      setIsNameEditing(false);
    } catch (error) {
      console.error("Failed to update organization name:", error);
    }
  };

  return (
    <div className="text-4xl font-bold">
      {isNameEditing ? (
        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleNameUpdate();
            }
          }}
          onBlur={handleNameUpdate} 
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-primary"
        />
      ) : (
        <div
          onClick={() => setIsNameEditing(true)}
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}
        >
          {updatedName}
          {isIconHovered && hasAdminRole && (
            <button onClick={() => setIsNameEditing(true)} className="ml-2">
              <Icon type="pencil" width={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableOrganizationName;
