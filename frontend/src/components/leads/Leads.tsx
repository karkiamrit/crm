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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import useAuth from "@/app/hooks/useAuth";
import CreateLead from "./sheet/CreateLead";
import useleadFormSubmitted from "@/store/leadFormSubmitted";
import useleadDeleted from "@/store/leadDeleted";
import { useStore } from "@/store/useStore";
import Link from "next/link";
// import CreateLeadForm from "./sheet/CreateLeadForm";
import LeadCreatePage from "@/components/leads/LeadCreatePage/LeadCreatePage";

export enum LeadsStatus {
  INITIAL = "INITIAL",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}
interface Lead {
  name: string;
  email: string;
  phone: string;
  status: LeadsStatus;
  address: string;
  id: number;
}

interface Range {
  property: string;
  lower: string;
  upper: string;
}
const titles = ["Name", "Email", "Phone", "Status", "Address", "Actions"];

const LeadsPage: React.FC = () => {
  const { userData, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<{ [property: string]: Range }>({});
  const [filterValues, setFilterValues] = useState<{
    [property: string]: string;
  }>({});
  const initialFilterValues: { [key: string]: string } = {};
  titles.forEach((title) => {
    initialFilterValues[title.toLowerCase()] = "";
  });
  const [tempFilter, setTempFilter] = useState<Range | null>(null);
  const { isLeadDataDeleted, setLeadDataDeleted } = useleadDeleted();
  const { isLeadFormSubmitted, setLeadFormSubmitted } = useleadFormSubmitted();
  const [totalLeads, setTotalLeads] = useState(0);

  const [page, setPage] = useState(1);
  const { leadStatus } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);


  const pageSize = 8;

  const fetchLeadsFromApi = async (url: string, appliedFilter: Range[]) => {
    const rangeFields = ["name", "email", "address"]; // Add other range fields here
    const range = appliedFilter
      .filter((f) => rangeFields.includes(f.property))
      .map(
        (f) =>
          `{"property":"${f.property}","lower":"${f.lower}","upper":"${f.upper}"}`
      )
      .join(",");
    const where = appliedFilter
      .filter((f) => !rangeFields.includes(f.property))
      .reduce((acc, f) => ({ ...acc, [f.property]: f.lower }), {});
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${LocalStore.getAccessToken()}`,
      },
      params: {
        ...where,
        range: `[${range}]`,
        skip: (page - 1) * pageSize,
        take: pageSize,
      },
    });
    const data = response.data.data;
    setTotalLeads(response.data.total);
    return Array.isArray(data) ? data : [];
  };

  const fetchLeads = async (appliedFilter: Range[]) => {
    try {
      const hasAgentRoleWithoutAdmin = userData?.roles.reduce(
        (acc, role) => {
          if (role.name === "Admin")
            return { isAdmin: true, isAgent: acc.isAgent };
          if (role.name === "Agent")
            return { isAdmin: acc.isAdmin, isAgent: true };
          return acc;
        },
        { isAdmin: false, isAgent: false }
      );
      if (
        hasAgentRoleWithoutAdmin?.isAgent &&
        !hasAgentRoleWithoutAdmin?.isAdmin
      ) {
        return fetchLeadsFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/myleads`,
          appliedFilter
        );
      } else {
        return fetchLeadsFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads`,
          appliedFilter
        );
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
  };
  const handleFilterChange = (range: Range) => {
    setTempFilter(range);
  };

  const applyFilter = () => {
    if (tempFilter) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [tempFilter.property]: tempFilter,
      }));
      setTempFilter(null);
    }
  };

  const clearFilter = (property: string) => {
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter };
      delete newFilter[property];
      return newFilter;
    });
  };

  useEffect(() => {
    const newAppliedFilter = Object.values(filter).map((filter) => ({
      ...filter,
    }));
    console.log(
      "Fetching leads with filter:",
      newAppliedFilter,
      "and page:",
      page
    );

    if (loading === false) {
      fetchLeads(newAppliedFilter).then((newLeads) => {
        setLeads(newLeads);
      });
    }
  }, [filter, page, loading]);

  useEffect(() => {}, [leads]);

  useEffect(() => {
    if (isLeadDataDeleted || isLeadFormSubmitted || leadStatus) {
      console.log(leadStatus);
      const newAppliedFilter = Object.values(filter).map((filter) => ({
        ...filter,
      }));
      fetchLeads(newAppliedFilter).then((newLeads) => {
        setLeads(newLeads);
      });
      setLeadDataDeleted(false);
      setLeadFormSubmitted(false);
    }
  }, [isLeadDataDeleted, isLeadFormSubmitted, leadStatus]);

  // Calculate total pages
  const totalPages = Math.ceil(totalLeads / pageSize);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:ml-[20%] lg:px-8 lg:w-[1200px] flex-wrap ">
      <div className=" lg:h-[35rem]">
        <div className="text-black lg:mb-5 flex flex-row items-center mt-4 justify-center md:justify-end mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>            <DialogTrigger asChild>
              <Button
                className="flex flex-row gap-2"
                onClick={() => setIsOpen(true)}
              >
                <Icon type="pencil" width={15} />
                Create new lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
              <DialogHeader>
              </DialogHeader>
              {/* form here */}
              <LeadCreatePage />
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full ">
              <thead className="md:table-header-group hidden">
                {" "}
                <tr>
                  {titles.map((title, index) => (
                    <th
                      key={index}
                      className={cn({
                        "px-4 py-7 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider gap-3 ":
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
                              <Icon type="list_filter" width={20} height={15} />
                            </PopoverTrigger>

                            <PopoverContent className="w-52">
                              <div className="flex flex-col items-start justify-start">
                                {title !== "Status" && (
                                  <Input
                                    id="width"
                                    placeholder={`Search ${title}`}
                                    className="col-span-2 h-8"
                                    value={
                                      filterValues[title.toLowerCase()] || ""
                                    }
                                    onFocus={(event) => {
                                      // This will prevent the input from selecting all text on focus
                                      setTimeout(() => {
                                        const len = event.target.value.length;
                                        event.target.setSelectionRange(
                                          len,
                                          len
                                        );
                                      }, 0);
                                    }}
                                    onChange={(e) => {
                                      handleFilterChange({
                                        property: title.toLowerCase(),
                                        lower: e.target.value,
                                        upper: String.fromCharCode(
                                          e.target.value.charCodeAt(0) + 1
                                        ),
                                      });
                                      setFilterValues((prev) => ({
                                        ...prev,
                                        [title.toLowerCase()]: e.target.value,
                                      }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        applyFilter();
                                      }
                                    }}
                                  />
                                )}
                                {title === "Status" && (
                                  <Select
                                    onValueChange={(selectedValue) => {
                                      handleFilterChange({
                                        property: title.toLowerCase(),
                                        lower: selectedValue,
                                        upper: selectedValue,
                                      });
                                      setFilterValues((prev) => ({
                                        ...prev,
                                        [title.toLowerCase()]: selectedValue,
                                      }));
                                    }}
                                    value={
                                      filterValues[title.toLowerCase()] || ""
                                    }
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                      {Object.values(LeadsStatus).map(
                                        (status) => (
                                          <SelectItem
                                            key={status}
                                            value={status}
                                          >
                                            {status}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                                <div className="flex flex-row justify-center items-center gap-2">
                                  <Button
                                    className="flex flex-row gap-2"
                                    onClick={applyFilter}
                                  >
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
                                    onClick={() => {
                                      clearFilter(title.toLowerCase());
                                      setFilterValues((prev) => {
                                        const newValues = { ...prev };
                                        delete newValues[title.toLowerCase()];
                                        return newValues;
                                      });
                                    }}
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
              {leads.length !== 0 && (
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads &&
                    leads.map((lead, index) => (
                      <TableRow
                        key={index}
                        name={lead.name}
                        email={lead.email}
                        phone={lead.phone}
                        status={lead.status}
                        country={lead.address}
                        id={lead.id}
                      />
                    ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <div>
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) {
                    setPage(page - 1);
                  }
                }}
              />
            </PaginationItem>
            {pageNumbers.slice(0, 8).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) {
                    setPage(page + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default LeadsPage;
