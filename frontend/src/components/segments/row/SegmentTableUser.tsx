import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import LeadSheet from "../sheet/LeadSheet";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import useleadDeleted from "@/store/leadDeleted";
import useAuth from "@/app/hooks/useAuth";
import { Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Lead } from "@/components/leads/Leads";

interface TableRowProps {
  name: string;
  description: string;
  id: number;
  userId: number;
  leads: Lead[];
  createdAt: Date;
}

const SegmentTableRow: React.FC<TableRowProps> = ({
  name,
  description,
  id,
  userId,
  leads,
  createdAt,
}) => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
  ]; // Add more colors as needed

  // Function to generate a random index
  const generateRandomIndex = () => {
    return Math.floor(Math.random() * colors.length);
  };

  // Get a random color from the colors array
  const randomColorIndex = generateRandomIndex();
  const randomBackgroundColor = colors[randomColorIndex];
  const { toast } = useToast();
  const { setLeadDataDeleted } = useleadDeleted();
  const { userData } = useAuth();
  return (
    <tr className="bg-white">
      <td className="px-4 py-3 text-sm font-light text-gray-900 align-top lg:align-middle whitespace-nowrap">
        {name}
      </td>
      <td className="px-4 py-3 text-sm font-light text-gray-900 align-top lg:align-middle whitespace-nowrap">
        {description}
      </td>
      <td className="px-4 py-3 text-sm font-light text-gray-900 align-top lg:align-middle whitespace-nowrap">
        {new Date(createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default SegmentTableRow;
