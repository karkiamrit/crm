import React, { useEffect, useState } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { LeadData } from "../data/data";
import { LocalStore } from "@/store/localstore";

type Props = {
  id: number;
};

const LeadSheet = (props: Props) => {
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8006/leads/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${LocalStore.getAccessToken()}`,
            },
          }
        );
        setLeadData(response.data);
      } catch (error) {
        console.error("Failed to fetch lead data:", error);
      }
    };

    fetchLeadData();
  }, [props.id]);
  return (
    <SheetHeader className="flex flex-col">
      <SheetTitle className="flex justify-center mt-10 text-3xl">
        Lead Details
      </SheetTitle>
      {leadData && (
        <div className="flex flex-row justify-start items-center text-xl mt-1 bg-gray-200 gap-5 pl-5">
          <div className="w-20 h-20 mb-5 mt-5 ">
            <Avatar className="rounded-full w-6 h-6 ">
              <AvatarFallback>
                {leadData.name.split(" ")[0][0].toUpperCase()}
                {leadData.name.split(" ")[1]
                  ? leadData.name.split(" ")[1][0].toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            
          </div>
          <div >{leadData.name}</div>
         
        </div>
      )}
    </SheetHeader>
  );
};

export default LeadSheet;
