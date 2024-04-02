// LeadSheet.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LeadData } from "../data/data";
import { LocalStore } from "@/store/localstore";
import { titlesWithIcons } from "../data/title";
import { cn } from "@/lib/utils";
import ContactStatus from "./Status";
import LeadStatusIcon from "./LeadStatusIcon";
import LeadStatusText from "./LeadStatusText";
import LeadAvatar from "./LeadAvatar";
import { SheetHeader } from "@/components/ui/sheet";
import LeadNote from "./LeadNote";
import Icon from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import useOutsideClick from '@/app/hooks/useOutsideClick';
import useleadDeleted from "@/store/leadDeleted";
import { useToast } from "@/components/ui/use-toast";


type Props = {
  id: number;
};

const LeadSheet = (props: Props) => {
  const ref = useOutsideClick(() => {
    if (isNameEditing) {
      setIsNameEditing(false);
    }
  });
  const {setLeadDataDeleted} = useleadDeleted()
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [currentTitles, setCurrentTitles] = useState<string[]>([]);
  const [updatedData, setUpdatedData] = useState<Partial<LeadData>>({});
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(leadData ? leadData.name : '');
  const [isIconHovered, setIsIconHovered] = useState(false);
  const {toast} = useToast();
  const { leadStatus } = useStore();
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${props.id}`,
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
  }, [props.id, updatedData]);
  useEffect(() => {
    if (leadData) {
      setUpdatedName(leadData.name);
    }
  }, [leadData]);
  return (
    <SheetHeader className="flex flex-col bg-gray-200">
      <div className="bg-white h-12"></div>
      
      {leadData && (
        <div className="flex flex-col ">
         
          <div className="flex flex-row justify-start items-center text-xl gap-5 pl-6 w-full lg:mt-5">
            <div className="w-24 h-24 ml-4 ">
              <LeadAvatar
                name={leadData.name}
                imageUrl="https://github.com/shadcn.png"
              />
            </div>
            <div className="text-2xl font-extrabold">
              <div
                className="text-2xl font-extrabold flex items-center"
                ref={ref}
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
                onClick={(e) => e.stopPropagation()}
              >
                {isNameEditing ? (
                  <Input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="bg-gray-100"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        setIsNameEditing(false);
                        try {
                          const response = await axios.put(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${props.id}`,
                            { ...leadData, name: updatedName },
                            {
                              headers: {
                                Authorization: `Bearer ${LocalStore.getAccessToken()}`,
                              },
                            }
                          );
                          if (response.data) {
                            setLeadData(response.data);
                          }
                        } catch (error) {
                          console.error("Failed to update lead data:", error);
                        }
                      }
                    }}
                  />
                ) : (
                  <div onDoubleClick={() => setIsNameEditing(true)} >
                    {leadData.name}
                    {isIconHovered && (
                      <button onClick={() => setIsNameEditing(true)} className="ml-2">
                          <Icon type="pencil" width={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" border-border-2 border-gray-200 w-[95%] mx-auto mt-4">
            <div className="flex flex-col mt-2 ">
              {titlesWithIcons.map((titleWithIcon) => (
                <div
                  key={titleWithIcon.title}
                  className={cn(
                    `flex flex-col border-gray-300 w-full h-auto pl-6 pt-2 pb-3 bg-white text-xs font-thin border-t${
                      titleWithIcon.title === "email"
                        ? "border-t rounded-t-md"
                        : ""
                    } ${
                      titleWithIcon.title === "service"
                        ? "border-b rounded-b-md "
                        : ""
                    }`
                  )}
                >
                  <div className="flex flex-row items-center gap-4">
                    <div className="text-gray-400">{titleWithIcon.icon}</div>

                    <div className="flex flex-col flex-grow">
                      <div className=" text-gray-500">
                        {titleWithIcon.title.charAt(0).toUpperCase() +
                          titleWithIcon.title.slice(1)}
                      </div>
                      {currentTitles.includes(titleWithIcon?.title) ? (
                        <Input
                          className="h-auto w-full mt-2"
                          type="text"
                          value={
                            titleWithIcon?.title === "email"
                              ? updatedData.email ?? leadData?.email ?? ""
                              : titleWithIcon?.title === "product"
                              ? updatedData.product?.name ??
                                leadData?.product?.name ??
                                ""
                              : titleWithIcon?.title === "service"
                              ? updatedData.service?.name ??
                                leadData?.service?.name ??
                                ""
                              : titleWithIcon?.title === "address"
                              ? updatedData.address ?? leadData?.address ?? ""
                              : titleWithIcon?.title === "details"
                              ? updatedData.details ?? leadData?.details ?? ""
                              : titleWithIcon?.title === "phone"
                              ? updatedData.phone ?? leadData?.phone ?? ""
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              titleWithIcon.title === "product" ||
                              titleWithIcon.title === "service"
                            ) {
                              // Update product or service name
                              setUpdatedData({
                                ...updatedData,
                                [titleWithIcon.title]: {
                                  ...(updatedData[titleWithIcon.title] ?? {}),
                                  name: value,
                                },
                              });
                            } else {
                              // Update other fields
                              setUpdatedData({
                                ...updatedData,
                                [titleWithIcon.title]: value,
                              });
                            }
                          }}
                        />
                      ) : (
                        <div className="text-gray-700">
                          {(() => {
                            const value =
                              leadData[titleWithIcon.title as keyof LeadData];
                            if (
                              titleWithIcon.title === "product" &&
                              leadData.product
                            ) {
                              return leadData.product.name;
                            } else if (
                              titleWithIcon.title === "service" &&
                              leadData.service
                            ) {
                              return leadData.service.name;
                            } else if (
                              typeof value === "string" &&
                              Date.parse(value)
                            ) {
                              return new Date(value).toLocaleDateString();
                            } else {
                              return String(value);
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    {currentTitles.includes(titleWithIcon.title) ? (
                      <div className="flex-row gap-2 mt-6 ml-auto pr-6 w-6 border-gray-300 lg:mr-32 flex h-6 items-center">
                        <Button
                          className=" hover:text-primary hover:border w-full  lg:w-16"
                          onClick={() => {
                            setCurrentTitles(
                              currentTitles.filter(
                                (title) => title !== titleWithIcon.title
                              )
                            );
                          }}
                          variant={"secondary"}
                        >
                          Cancel
                        </Button>
                        <Button
                          className=" hover:border-primary w-full lg:w-16"
                          variant={"default"}
                          onClick={async () => {
                            setCurrentTitles([]);

                            try {
                              const response = await axios.put(
                                `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${props.id}`,
                                updatedData,
                                {
                                  headers: {
                                    Authorization: `Bearer ${LocalStore.getAccessToken()}`,
                                  },
                                }
                              );
                              if (response.data) {
                                setLeadData(response.data);
                              }
                            } catch (error) {
                              console.error(
                                "Failed to update lead data:",
                                error
                              );
                            }
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {!["createdAt"].includes(titleWithIcon.title) && (
                          <div className="ml-auto pr-6 border rounded-md w-6 border-gray-300 mr-4 bg-gray-200 flex h-6 items-center text-center">
                            <button
                              className="text-center pl-1 hover:text-primary hover:border-primary"
                              onClick={() => {
                                setCurrentTitles([
                                  ...currentTitles,
                                  titleWithIcon.title,
                                ]);
                              }}
                            >
                              <Icon type="pencil" width={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="pl-5 pr-5 flex flex-col mt-8">
                <div className="text-gray-900 font-bold text-sm flex flex-row gap-2">
                  <div>Lead Status :</div>
                  <LeadStatusIcon status={leadStatus} />
                  <LeadStatusText status={leadStatus} />
                </div>
                <div className="mt-5">
                  <ContactStatus
                    initialStatus={leadData.status}
                    id={leadData.id}
                  />
                </div>
              </div>
              {leadData.documents && (
                <div className="mt-8 flex flex-col gap-2">
                  {leadData.documents.map((document) => (
                    <div key={document}>{document}</div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <LeadNote id={leadData.id}/>
              </div>

              <div className="flex flex-row justify-between mt-8 pl-6 pr-6 mb-16 text-sm font-extralight text-gray-700">
                <div>Lead ID: {leadData.id}</div>
                <div className="flex flex-row gap-2 text-primary" onClick={async () => {
              try {
                const response = await axios.delete(
                  `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads/${props.id}`,
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
                  throw new Error("An error occurred while deleting the lead.");
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
            }}>
                  <Icon type="trash" width={10} />
                  Delete Lead
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SheetHeader>
  );
};

export default LeadSheet;
