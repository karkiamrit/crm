// In your OrganizationTableRow component:
import React from "react";
import { Role } from "../Organization";

interface OrganizationTableRowProps {
  email: string;
  roles: Role[]; // Assuming role is an array of strings
}

const OrganizationTableRow: React.FC<OrganizationTableRowProps> = ({
  email,
  roles,
}) => {
  return (
    <tr className="bg-white">
      <td className="px-4 py-3 text-sm font-light text-gray-900 align-top lg:align-middle whitespace-nowrap">
        {email}
      </td>
      {/* Render role if it exists */}
      <td className="px-4 py-3 text-sm font-light text-gray-900 align-top lg:align-middle whitespace-nowrap">
      {roles.map((role) => (
          <span key={role.id}>{role.name}</span>
        ))}
      </td>
    </tr>
  );
};

export default OrganizationTableRow;
