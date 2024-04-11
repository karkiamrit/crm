import React, { useState, useEffect } from "react";
import { LeadsStatus } from "../Leads";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import {useStore} from "@/store/useStore"
import { Button } from "@/components/ui/button";

type Props = {
  initialStatus: LeadsStatus;
  id: number;
};
const ContactStatus: React.FC<Props> = ({ initialStatus, id }) => {
  const [status, setStatus] = useState<LeadsStatus>(initialStatus);
  const {setLeadStatus} = useStore();

  useEffect(() => {
    // Set initial status when component mounts
    setStatus(initialStatus);
  }, [initialStatus]);

  const updateStatus = async (newStatus: LeadsStatus) => {
    try {
      // Update status in state
      setStatus(newStatus);
      setLeadStatus(newStatus);
      
      // Make API call to update status
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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
    [LeadsStatus.PENDING]: "bg-blue-500 text-white",
    [LeadsStatus.CONFIRMED]: "bg-blue-500 text-white",
    [LeadsStatus.REJECTED]: "bg-red-500 text-white",
    [LeadsStatus.COMPLETED]: "bg-green-500 text-white",
  };

  return (
    <div className="sm:-mx-2">
      <ul className="flex rounded-2xl overflow-hidden border border-gray-200 text-center bg-white">
        {statusList.map((buttonStatus) => (
          <li
            key={buttonStatus}
            className={`flex-1 px-0 lg:px-2 py-2 ${
              getStatusColor(status, buttonStatus)
            }`}
          >
            <Button
              onClick={() => updateStatus(buttonStatus)}
              variant="secondary"
              className={`text-xs font-thin border-none hover:bg-transparent focus:bg-transparent shadow-none  ${getStatusColor(status, buttonStatus)} bg-transparent`}
            >
              {buttonStatus.charAt(0).toUpperCase() +
                buttonStatus.slice(1).toLowerCase()}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactStatus;
