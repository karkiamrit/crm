"use-client";
import React, { useEffect, useState } from "react";
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

import useAuth from "@/app/hooks/useAuth";
// import CreateUser from "./sheet/CreateUser";
import useOrganizationFormSubmitted from "@/store/organizationFormSubmitted";
import OrganizationTableRow from "./row/OrganizationUserTableRow";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import OrganizationFrame from "./row/Items/OrganizationFrame";
import EditableOrganizationName from "./row/Items/Editable OrganizationName";
import ProfileAvatar from "./row/Items/OrganizationProfileAvatar";
import CreateUserForm from "./row/Items/UserCreate";
import useUserCreated from "@/store/useUserCreated";
import useFetchOrganization from "@/app/hooks/useFetchOrganization";

export interface Organization {
  id: number;
  email: string;
  name: string;
  logo: string | null;
  address: string;
  phone: string;
}
export interface Role {
  id: number;
  name: string;
}
interface User {
  id: number;
  roles: Role[];
  email: string;
}
interface Range {
  property: string;
  lower: string;
  upper: string;
}
const titles = ["Email", "Role"];

const OrganizationsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<{ [property: string]: Range }>({});
  const [filterValues, setFilterValues] = useState<{
    [property: string]: string;
  }>({});
  const initialFilterValues: { [key: string]: string } = {};
  titles.forEach((title) => {
    initialFilterValues[title.toLowerCase()] = "";
  });
  const [tempFilter, setTempFilter] = useState<Range | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const { userData, loading } = useAuth();
  const [page, setPage] = useState(1);
  const hasAdminRole = userData?.roles.some((role) => role.name === "Admin");
  const {isUserCreated, setUserCreated} = useUserCreated();
  // const {isOrganizationFormSubmitted, setOrganizationFormSubmitted} = useOrganizationFormSubmitted();
  const pageSize = 8;

  const [organization, setOrganization] = useState<Organization | null>(null);

  useFetchOrganization(setOrganization);


  const fetchUsersFromApi = async (url: string, appliedFilter: Range[]) => {
    const rangeFields = ["email", "role"]; // Add other range fields here
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
    setTotalUsers(response.data.total);
    return Array.isArray(data) ? data : [];
  };

  const fetchUsers = async (appliedFilter: Range[]) => {
    try {
      // const hasAgentRoleWithoutAdmin = userData?.roles.reduce(
      //   (acc, role) => {
      //     if (role.name === "Admin")
      //       return { isAdmin: true, isAgent: acc.isAgent };
      //     if (role.name === "Agent")
      //       return { isAdmin: acc.isAdmin, isAgent: true };
      //     return acc;
      //   },
      //   { isAdmin: false, isAgent: false }
      // );
      // if (
      //   hasAgentRoleWithoutAdmin?.isAgent &&
      //   !hasAgentRoleWithoutAdmin?.isAdmin
      // ) {
      return fetchUsersFromApi(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations/${userData?.organizationId}/users`,
        appliedFilter
      );
      // } else {
      //   return fetchUsersFromApi(
      //     `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/users`,
      //     appliedFilter
      //   );
    } catch (error) {
      console.error("Error fetching users:", error);
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
      "Fetching users with filter:",
      newAppliedFilter,
      "and page:",
      page
    );

    if (loading === false) {
      fetchUsers(newAppliedFilter).then((newUsers) => {
        setUsers(newUsers);
      });
    }
  }, [filter, page, loading]);

  useEffect(() => {}, [users]);


  useEffect(() => {
    if (isUserCreated) {
      const newAppliedFilter = Object.values(filter).map((filter) => ({
        ...filter,
      }));
      fetchUsers(newAppliedFilter).then((newUsers) => {
        setUsers(newUsers);
      });
      setUserCreated(false);
    }
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:w-[1600px] flex-wrap ">
      <div className="py-8 lg:h-[47rem]">
        <div className="flex flex-row items-center justify-between gap-6 lg:pb-6">
          <div className="flex flex-row items-center gap-6 pl-6">
            {organization?.logo && (
              <ProfileAvatar
                src={
                  process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS +
                  "/" +
                  organization?.logo
                }
                organizationId={organization.id}
              />
            )}
            
            {organization && (
              <EditableOrganizationName
                organization={organization}
                hasAdminRole={hasAdminRole}
              />
            )}
          </div>
          <div><CreateUserForm/></div>

          {/* <div className="text-black flex flex-row items-center justify-end pr-6">
            <CreateOrganizationForm />
          </div> */}
        </div>
        <Separator className="w-full lg:mb-10" />
        <div className="flex flex-row gap-10">
          <div className="overflow-x-auto w-full">
            <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full ">
                <thead>
                  <tr className="px-4 py-7 bg-gray-50 text-left text-xs   tracking-wider gap-3 ">
                    <th className="px-4 py-7 bg-gray-50 text-left text-xs   tracking-wider gap-3  ">
                      <div className="flex">
                        <div className="flex gap-3 items-center font-black text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-users-round"
                          >
                            <path d="M18 21a8 8 0 0 0-16 0" />
                            <circle cx="10" cy="8" r="5" />
                            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                          </svg>
                          Associated Users
                        </div>
                      </div>
                    </th>
                    <th className=" bg-gray-50 flex justify-end px-4 py-7 ml-auto gap-2">
                      <div className="text-gray-600">Total Users:</div>
                      {totalUsers}
                    </th>
                  </tr>
                  <tr>
                    <th className=" bg-gray-50">
                      <Separator />
                    </th>
                    <th className=" bg-gray-50">
                      <Separator />
                    </th>
                  </tr>

                  <tr>
                    {titles.map((title, index) => (
                      <th
                        key={index}
                        className={cn(
                          "px-4 py-7 bg-gray-50 text-xs font-black  tracking-wider gap-3 "
                        )}
                      >
                        <div className="flex justify-between gap-8">
                          {title}

                          {title !== "Role" && (
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
                {users.length !== 0 && (
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users &&
                      users.map((user, index) => (
                        <OrganizationTableRow
                          key={index}
                          email={user.email}
                          roles={user.roles}
                        />
                      ))}
                  </tbody>
                )}
              </table>
            </div>
            
          </div>
          
          {organization && (
            <OrganizationFrame
              id= {organization.id}
              email={organization.email}
              phone={organization.phone}
              address={organization.address}
              hasAdminRole={hasAdminRole}
            />
          )}
        </div>
      </div>
      <Pagination className="flex justify-center pl-24">
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
                    href="#hi"
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
  );
};

export default OrganizationsPage;
