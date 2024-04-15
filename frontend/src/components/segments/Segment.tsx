"use-client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LocalStore } from "@/store/localstore";
import axios from "axios";
// import Icon from "../icons";
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

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Lead } from "../leads/Leads";
import SegmentTableRow from "./row/SegmentTableUser";
import CreateSegmentForm from "./frames/CreateSegmentForm";
// import CreateSegmentForm from "./sheet/CreateSegmentForm";


interface Segment {
  name: string;
  description: string;
  id: number;
  userId: number;
  leads: Lead[];
  createdAt: Date;

}

interface Range {
  property: string;
  lower: string;
  upper: string;
}
const titles = ["Name", "Description", "Created Time", "Actions"];

const SegmentsPage: React.FC = () => {
  // const { isSegmentEdited, setSegmentEdited } = usesegmentEdited();
  const { userData, loading } = useAuth();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [filter, setFilter] = useState<{ [property: string]: Range }>({});
  const [filterValues, setFilterValues] = useState<{
    [property: string]: string;
  }>({});
  const initialFilterValues: { [key: string]: string } = {};
  titles.forEach((title) => {
    initialFilterValues[title.toLowerCase()] = "";
  });
  const [tempFilter, setTempFilter] = useState<Range | null>(null);
  // const { isSegmentDataDeleted, setSegmentDataDeleted } = usesegmentDeleted();
  // const { isSegmentFormSubmitted, setSegmentFormSubmitted } = usesegmentFormSubmitted();
  const [totalSegments, setTotalSegments] = useState(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);  
  // const { selectedSegments, setSelectedSegments } = useSelectedSegmentsStore();

  // React.useEffect(() => {
  //   console.log(selectedSegments);
  // }, [selectedSegments]);

  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = React.useState(false);

  const pageSize = 8;

  const fetchSegmentsFromApi = async (url: string, appliedFilter: Range[]) => {
    const rangeFields = ["name", "description", "Created Date"]; 
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
    setTotalSegments(response.data.total);
    return Array.isArray(data) ? data : [];
  };

  const fetchSegments = async (appliedFilter: Range[]) => {
    try {
     
        const response= await fetchSegmentsFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/segments`,
          appliedFilter
        )
        return response;
        
      
    } catch (error) {
      console.error("Error fetching segments:", error);
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
      "Fetching segments with filter:",
      newAppliedFilter,
      "and page:",
      page
    );
    if (loading === false) {
      fetchSegments(newAppliedFilter).then((newSegments) => {
        setSegments(newSegments);
      });
    }
  }, [filter, page, loading]);

  
  useEffect(() => {}, [segments]);

  // useEffect(() => {
  //   console.log("useEffect triggered");
  //   if (
  //     isSegmentDataDeleted ||
  //     isSegmentFormSubmitted ||
  //     isSegmentEdited ||
  //     segmentStatus
  //   ) {
  //     console.log("Condition met, setting up debounce...");
  //     if (debounceTimeout.current !== null) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //     debounceTimeout.current = setTimeout(() => {
  //       console.log("Debounce time passed, fetching segments...");
  //       const newAppliedFilter = Object.values(filter).map((filter) => ({
  //         ...filter,
  //       }));
  //       fetchSegments(newAppliedFilter).then((newSegments) => {
  //         console.log("New segments fetched:", newSegments);
  //         setSegments(newSegments);
  //       });
  //       setSegmentDataDeleted(false);
  //       setSegmentFormSubmitted(false);
  //       setSegmentEdited(false);
  //     }, 500); // 500ms debounce time
  //   }
  // }, [isSegmentDataDeleted, isSegmentFormSubmitted, isSegmentEdited, segmentStatus]);

  // Calculate total pages
  const totalPages = Math.ceil(totalSegments / pageSize);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6  ">
      <div
        className={cn(
          "lg:min-h-[45rem] "
        )}
      >
        <div className="text-black lg:mb-5 flex flex-row items-center mt-4 justify-center md:justify-end mb-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {" "}
            <DialogTrigger asChild>
              <Button
                className="flex flex-row gap-2"
                onClick={() => setIsOpen(true)}
              >
                {/* <Icon type="pencil" width={15} /> */}
                Create new segment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
              <DialogHeader></DialogHeader>

              <CreateSegmentForm />
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
                              {/* <Icon type="list_filter" width={20} height={15} /> */}
                            </PopoverTrigger>

                            <PopoverContent className="w-52">
                              <div className="flex flex-col items-start justify-start">
                                {title !== "Status" && (
                                  <Input
                                    id="width"
                                    placeholder={`Search ${title}`}
                                    className="col-span-2 h-10"
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
                                <div className="flex flex-row justify-center mt-4  items-center gap-4">
                                  <Button
                                    className="flex flex-row gap-2"
                                    onClick={applyFilter}
                                  >
                                    Filter
                                    {/* <Icon
                                      type="filter"
                                      width={20}
                                      height={15}
                                    /> */}
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
              {segments.length !== 0 && (
                <tbody className="bg-white divide-y divide-gray-200">
                  {segments &&
                    segments.map((segment, index) => (
                      <SegmentTableRow
                        key={segment.id}
                        name={segment.name}
                        description={segment.description}
                        userId={segment.userId}
                        leads={segment.leads}
                        id={segment.id}
                        createdAt= {segment.createdAt}
                      
                      />
                    ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <div>
        <Pagination className={cn("mt-2")}>
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

export default SegmentsPage;
