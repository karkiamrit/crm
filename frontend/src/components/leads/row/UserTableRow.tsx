import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { LeadsStatus } from "../Leads";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LeadSheet from "../sheet/LeadSheet";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import useleadDeleted from "@/store/leadDeleted";
import useAuth from "@/app/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import DrawerContentDemo from "./DrawerContent";

interface TableRowProps {
  name: string;
  email: string;
  phone: string;
  status: LeadsStatus;
  country: string;
  id: number;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  name,
  email,
  phone,
  status,
  country,
  id,
  isSelected,
  onSelect,
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

  const statusColors: Record<LeadsStatus, string> = {
    [LeadsStatus.INITIAL]: "border-violet-500 border  text-violet-500",
    [LeadsStatus.PENDING]: "border-blue-500 border text-blue-500",
    [LeadsStatus.CONFIRMED]: "border-blue-500 border text-blue-500",
    [LeadsStatus.REJECTED]: "border-red-500 border text-red-500",
    [LeadsStatus.COMPLETED]: "border-green-500 border text-green-500",
  };

  const statusIcons: Record<LeadsStatus, string> = {
    [LeadsStatus.INITIAL]: "",
    [LeadsStatus.PENDING]: "",
    [LeadsStatus.CONFIRMED]: "",
    [LeadsStatus.REJECTED]: "",
    [LeadsStatus.COMPLETED]: "",
  };

  return (
    <tr className="bg-white">
      <Drawer>
        <td className="p-4 bg-white rounded-lg shadow-md md:shadow-none text-sm font-bold text-gray-900 align-top lg:align-middle whitespace-nowrap">
          <div className="flex items-center">
            <DrawerTrigger asChild>
              <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            </DrawerTrigger>
          </div>
        </td>

        <td className="p-4 bg-white rounded-lg shadow-md md:shadow-none text-sm font-bold text-gray-900 align-top lg:align-middle whitespace-nowrap">
          <div className="flex-col md:flex-row font-bold space-y-4 flex items-center gap-2">
            <Avatar className="m-2 ">
              <AvatarFallback className={randomBackgroundColor}>
                {`${name.split(" ")[0][0].toUpperCase()}${
                  name.split(" ")[1]
                    ? name.split(" ")[1][0].toUpperCase()
                    : name.split(" ")[0][0].toUpperCase()
                }`}
              </AvatarFallback>
            </Avatar>
            {name}
          </div>
          <div className="mt-1 space-y-2 font-medium pl-1 md:pl-11  lg:hidden">
            <div className="flex items-center justify-center md:justify-start">
              <svg
                className="w-4 h-4 mr-2 text-gray-400 hidden md:inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {email}
            </div>

            <div className="flex items-center justify-center md:justify-start">
              <svg
                className="w-4 h-4 mr-2 text-gray-400 hidden md:inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {phone}
            </div>

            <div
              className={`flex items-center justify-center md:justify-start mx-20 px-2 py-1 rounded-sm ${statusColors[status]}`}
            >
              {statusIcons[status]}
              {status}
            </div>

            <div className="flex items-center pt-3 space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none hover:text-white hover:border-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Details
              </button>

              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="w-5 h-5 mr-2 -ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </td>

        <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {email}
          </div>
        </td>

        <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {phone}
          </div>
        </td>

        <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 xl:table-cell whitespace-nowrap">
          <div
            className={`flex items-center justify-center md:justify-start p-2 rounded-sm ${statusColors[status]}`}
          >
            {statusIcons[status]}
            {status}
          </div>
        </td>

        <td className="p-4 hidden md:block text-center text-sm font-medium pt-8 uppercase text-gray-900 align-top lg:align-middle lg:text-left whitespace-nowrap">
          {country}
        </td>

        {userData?.roles &&
          userData.roles.some(
            (role) => role.name === "Agent" || role.name === "Admin"
          ) && (
            <td className="hidden px-4 py-4 lg:table-cell whitespace-nowrap">
              <div className="flex items-center space-x-4">
                <Sheet>
                  <SheetTrigger className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                    Edit Details
                  </SheetTrigger>
                  <SheetContent className="overflow-auto">
                    <LeadSheet id={id} />
                  </SheetContent>
                </Sheet>

                <Button
                  variant="ghost"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md shadow-sm"
                  onClick={async () => {
                    try {
                      const response = await axios.delete(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
                          },
                        }
                      );

                      if (response.status === 200 || response.status === 201) {
                        console.log("Lead deleted successfully");
                        setLeadDataDeleted(true);
                      } else {
                        throw new Error(
                          "An error occurred while deleting the lead."
                        );
                      }
                    } catch (err: any) {
                      toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description:
                          `${
                            err.response?.data?.message ||
                            "An error occurred while deleting the lead."
                          } ` +
                          `${
                            err.response?.data?.error
                              ? `Error: ${err.response?.data?.error?.message}`
                              : ""
                          } ` +
                          `${
                            err.response?.data?.statusCode
                              ? `Status Code: ${err.response?.data?.statusCode}`
                              : ""
                          }`,
                      });
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2 -ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove
                </Button>
              </div>
            </td>
          )}

        <DrawerContent className="flex justify-between">
          <DrawerContentDemo />
        </DrawerContent>
      </Drawer>
    </tr>
  );
};

export default TableRow;
