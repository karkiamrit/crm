import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

interface TableRowProps {
  name: string;
  email: string;
  phone: string;
  date: string;
  country: string;
}

const TableRow: React.FC<TableRowProps> = ({
  name,
  email,
  phone,
  date,
  country,
}) => {
  const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200']; // Add more colors as needed

    // Function to generate a random index
    const generateRandomIndex = () => {
        return Math.floor(Math.random() * colors.length);
    };

    // Get a random color from the colors array
    const randomColorIndex = generateRandomIndex();
    const randomBackgroundColor = colors[randomColorIndex];

  return (
    <tr className="bg-white">
      <td className="px-4 py-3 text-sm font-bold text-gray-900 align-top lg:align-middle whitespace-nowrap">
        <div className="flex items-center gap-2">
         <Avatar>
          <AvatarFallback className={randomBackgroundColor} >CN</AvatarFallback>
         </Avatar>
          {name}
        </div>
        <div className="mt-1 space-y-2 font-medium pl-11 lg:hidden">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {date}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {date}
        </div>
      </td>

      <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 align-top lg:align-middle lg:text-left whitespace-nowrap">
        {country}
      </td>

      <td className="hidden px-4 py-4 lg:table-cell whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none hover:text-white hover:border-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Details
          </button>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      </td>
    </tr>
  );
};

export default TableRow;
