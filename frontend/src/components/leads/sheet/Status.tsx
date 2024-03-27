import React, { useState } from "react";
import { LeadsStatus } from "../Leads";
import axios from "axios";
import { LocalStore } from "@/store/localstore";

type Props = {
  initialStatus: LeadsStatus;
  id: number;
};
const ContactStatus: React.FC<Props> = ({initialStatus, id}) => {

    
  const [status, setStatus] = useState<LeadsStatus>(initialStatus);

  const updateStatus = (status: LeadsStatus) => {
    setStatus(status);
    // Make API call to update status
    axios.put(`http://localhost:8006/leads/${id}`, { status }, {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
    }).catch(error => {
      console.error("Failed to update status:", error);
    });
  };

  const statusList: LeadsStatus[] = [
    LeadsStatus.INITIAL,
    LeadsStatus.PENDING,
    LeadsStatus.CONFIRMED,
    LeadsStatus.REJECTED,
    LeadsStatus.COMPLETED,
  ];

  const getStatusColor = (
    currentStatus: LeadsStatus,
    buttonStatus: LeadsStatus
  ): string => {
    if (buttonStatus === currentStatus) {
      return statusColors[currentStatus];
    }
    if (currentStatus === LeadsStatus.INITIAL) {
      return "";
    }
    if (statusList.indexOf(buttonStatus) <= statusList.indexOf(currentStatus)) {
      return statusColors[currentStatus];
    }
    return "";
  };

  const statusColors: Record<LeadsStatus, string> = {
    [LeadsStatus.INITIAL]: "bg-violet-500 text-white",
    [LeadsStatus.PENDING]: "bg-blue-600 text-white",
    [LeadsStatus.CONFIRMED]: "bg-blue-600 text-white",
    [LeadsStatus.REJECTED]: "bg-red-600 text-white",
    [LeadsStatus.COMPLETED]: "bg-green-600 text-white",
  };

  return (
    <div>
      <ul className="flex rounded-2xl overflow-hidden border border-gray-200 text-center">
        {statusList.map((buttonStatus) => (
          <li
            key={buttonStatus}
            className={`flex-1 px-4 py-2 bg-white ${getStatusColor(
              status,
              buttonStatus
            )}`}
          >
            <button
              onClick={() => updateStatus(buttonStatus)}
              className="text-xs font-thin"
            >
              {buttonStatus.charAt(0).toUpperCase() +
                buttonStatus.slice(1).toLowerCase()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactStatus;
