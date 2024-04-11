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

import useAuth from "@/app/hooks/useAuth";
// import usecustomerFormSubmitted from "@/store/customerFormSubmitted";
// import usecustomerDeleted from "@/store/customerDeleted";
import { useStore } from "@/store/useStore";
import { Checkbox } from "../ui/checkbox";

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  id: number;
}

interface Range {
  property: string;
  lower: string;
  upper: string;
}
const titles = ["Name", "Email", "Phone", "Address"];

const CustomerPage: React.FC = () => {
  const { userData, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [filter, setFilter] = useState<{ [property: string]: Range }>({});
  const [filterValues, setFilterValues] = useState<{
    [property: string]: string;
  }>({});
  const initialFilterValues: { [key: string]: string } = {};
  titles.forEach((title) => {
    initialFilterValues[title.toLowerCase()] = "";
  });
  const [tempFilter, setTempFilter] = useState<Range | null>(null);
  // const { isCustomerDataDeleted, setCustomerDataDeleted } = usecustomerDeleted();
  // const { isCustomerFormSubmitted, setCustomerFormSubmitted } =
  //   usecustomerFormSubmitted();
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [page, setPage] = useState(1);

  const pageSize = 8;

  const fetchCustomersFromApi = async (url: string, appliedFilter: Range[]) => {
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
    setTotalCustomers(response.data.total);
    return Array.isArray(data) ? data : [];
  };

  const fetchCustomers = async (appliedFilter: Range[]) => {
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
      return fetchCustomersFromApi(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/customers`,
        appliedFilter
      );
      // } else {
      //   return fetchCustomersFromApi(
      //     `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/customers`,
      //     appliedFilter
      //   );
      // }
    } catch (error) {
      console.error("Error fetching customers:", error);
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
      "Fetching customers with filter:",
      newAppliedFilter,
      "and page:",
      page
    );

    if (loading === false) {
      fetchCustomers(newAppliedFilter).then((newCustomers) => {
        setCustomers(newCustomers);
      });
    }
  }, [filter, page, loading]);

  useEffect(() => {}, [customers]);

  // useEffect(() => {
  //   if (isCustomerDataDeleted || isCustomerFormSubmitted) {
  //     const newAppliedFilter = Object.values(filter).map((filter) => ({
  //       ...filter,
  //     }));
  //     fetchCustomers(newAppliedFilter).then((newCustomers) => {
  //       setCustomers(newCustomers);
  //     });
  //     setCustomerDataDeleted(false);
  //     setCustomerFormSubmitted(false);
  //   }
  // }, [isCustomerDataDeleted, isCustomerFormSubmitted]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCustomers / pageSize);
  useEffect(() => {
    console.log("Selected customers:", selectedCustomers);
  }, [selectedCustomers]);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:ml-[20%] lg:w-[1200px] flex-wrap ">
      <div className=" lg:h-[35rem]">
        <div className="text-black lg:mb-5 flex flex-row items-center mt-4 justify-center md:justify-end mb-4">
          {/* <Link
              href="/customers/create"
              className="inline-block bg-primary rounded-md px-3 py-1.5 text-white"
            >
              Create Customer
            </Link> */}
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full overflow-hidden align-middle border border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full ">
              <thead className="md:table-header-group hidden">
                {" "}
                <tr>
                  <th className="px-4 py-7 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider gap-3">
                    <Checkbox
                      checked={selectedCustomers.length === customers.length}
                      onCheckedChange={(isChecked) => {
                        setSelectedCustomers(
                          isChecked
                            ? customers.map((customer) => customer.id)
                            : []
                        );
                      }}
                    />
                  </th>

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
              {customers.length !== 0 && (
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers &&
                    customers.map((customer, index) => (
                      <TableRow
                        key={index}
                        name={customer.name}
                        email={customer.email}
                        phone={customer.phone}
                        country={customer.address}
                        id={customer.id}
                        isSelected={selectedCustomers.includes(customer.id)}
                        onSelect={(isSelected) =>
                          isSelected
                            ? setSelectedCustomers((prev) => [
                                ...prev,
                                customer.id,
                              ])
                            : setSelectedCustomers((prev) =>
                                prev.filter((id) => id !== customer.id)
                              )
                        }
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

export default CustomerPage;
