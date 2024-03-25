"use-client";
import React, { useEffect, useState } from "react";
import TableRow from "./row/UserTableRow";
import { cn } from "@/lib/utils";
import { LocalStore } from "@/store/localstore";
import axios from "axios";
import Icon from "../icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Lead {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  address: string;
}

const titles = ["Name", "Email", "Phone", "Created At", "Address", "Actions"];

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [appliedFilter, setAppliedFilter] = useState<{ [key: string]: string }>({});

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:8006/leads/myleads", {
        headers: {
          Authorization: `Bearer ${LocalStore.getAccessToken()}`,
        },
        params: appliedFilter,
      });
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
  };

  // Add a function to handle the filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const applyFilter = () => {
    setAppliedFilter({ ...filter });
  };

  // Add a function to clear the filter
  const clearFilter = () => {
    setFilter({});
  };

  useEffect(() => {
    fetchLeads().then((fetchedLeads) => {
      setLeads(fetchedLeads);
    });
  }, [appliedFilter]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {leads.length !== 0 && (
        <div className="py-8">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {titles.map((title, index) => (
                      <th
                        key={index}
                        className={cn({
                          "px-4 py-7 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider gap-3":
                            true,
                          "text-center justify-center items-center":
                            title === "Actions",
                        })}
                      >
                        <div className="flex justify-between gap-8">
                          {title}

                          {title !== "Actions" && (
                            <Popover>
                              <PopoverTrigger>
                                <Icon
                                  type="list_filter"
                                  width={20}
                                  height={15}
                                />
                              </PopoverTrigger>

                              <PopoverContent className="w-52">
                                <div className="flex flex-col items-center gap-4">
                                  <Input
                                    id="width"
                                    placeholder={`Search ${title}`}
                                    className="col-span-2 h-8"
                                    onChange={(e) =>
                                      handleFilterChange(
                                        title.toLowerCase(),
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="flex flex-row justify-center items-center gap-2">
                                    <Button className="flex flex-row gap-2" onClick={applyFilter}>
                                      Filter
                                      <Icon
                                        type="filter"
                                        width={20}
                                        height={15}
                                        
                                      />
                                    </Button>
                                    <Button
                                      variant={"secondary"}
                                      className="border-primary border text-primary"
                                      onClick={clearFilter}
                                    >
                                      Clear
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads &&
                    leads.map((lead, index) => (
                      <TableRow
                        key={index}
                        name={lead.name}
                        email={lead.email}
                        phone={lead.phone}
                        date={new Date(lead.createdAt).toLocaleString()}
                        country={lead.address}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {leads.length === 0 && (
        <div className="flex items-center w-full lg:[900px] justify-center  h-[70vh] text-center text-primary text-4xl">
          You don't have any leads till now. Please Add Some Leads Before
          Viewing.
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
