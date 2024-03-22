"use-client"
import React, { useEffect } from "react";
import TableRow from "./row/UserTableRow";
import { cn } from "@/lib/utils";

const titles = ["Name", "Email", "Phone", "Created At", "Address", "Actions"];

const LeadsPage: React.FC = () => {

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr>
                  {titles.map((title, index) => (

                    <th
                      key={index}
                      className={cn({"px-4 py-7 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider":true,"text-center":title==="Actions"})}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <TableRow
                  imageUrl="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/table-list/1/avatar-male-2.png"
                  name="John Doe"
                  email="john.doe@example.com"
                  phone="(123) 456-7890"
                  date="November 10, 2021"
                  country="USA"
                />
                <TableRow
                  imageUrl="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/table-list/2/avatar-male-3.png"
                  name="Darlene Robertson"
                  email="darlene.robertson@example.com"
                  phone="(480) 555-0103"
                  date="November 9, 2021"
                  country="USA"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
