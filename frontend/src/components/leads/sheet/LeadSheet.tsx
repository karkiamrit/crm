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
import { z } from "zod";
import { LeadsStatus } from "../Leads";
const ProductSchema = z.object({
  name: z.string(),
});

const ServiceSchema = z.object({
  name: z.string(),
});

const LeadTimelineSchema = z.object({
  attribute: z.string(),
  value: z.string(),
  createdAt: z.date(),
});

const LeadDataSchema = z.object({
  id: z.number(),
  address: z.string(),
  details: z.string(),
  status: z.nativeEnum(LeadsStatus),
  phone: z.string(),
  email: z.string().email(),
  name: z.string(),
  priority: z.number(),
  createdAt: z.date(),
  source: z.string(),
  timelines: z.array(LeadTimelineSchema),
  product: ProductSchema,
  service: ServiceSchema,
  documents: z.array(z.string()),
  agentId: z.number(),
});

type Props = {
  id: number;
};

const LeadSheet = (props: Props) => {
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [currentTitles, setCurrentTitles] = useState<string[]>([]);
  const [updatedData, setUpdatedData] = useState<Partial<LeadData>>({});
  const [selectedButton, setSelectedButton] = React.useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8006/leads/${props.id}`,
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
  }, [props.id]);

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
            <div className="text-2xl font-extrabold">{leadData.name}</div>
          </div>
          <div className=" border-border-2 border-gray-200 w-[95%] mx-auto mt-4">
            <div className="flex flex-col mt-2 ">
              {titlesWithIcons.map((titleWithIcon) => (
                <div
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
                            titleWithIcon
                              ? typeof updatedData[titleWithIcon.title as keyof typeof updatedData] === "object"
                                ? updatedData[titleWithIcon.title as keyof typeof updatedData] instanceof Date
                                  ? (updatedData[titleWithIcon.title as keyof typeof updatedData] as Date).toISOString()
                                  : ""
                                : updatedData[titleWithIcon.title as keyof typeof updatedData]?.toString() ?? ""
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const schema =
                              LeadDataSchema.shape[
                                titleWithIcon.title as keyof typeof LeadDataSchema.shape
                              ];

                            if (schema) {
                              try {
                                schema.parse(value);
                                setUpdatedData({
                                  ...updatedData,
                                  [titleWithIcon.title]: value,
                                });
                              } catch (error) {
                                console.error("Invalid input:", error);
                              }
                            }
                          }}
                        />
                      ) : (
                        <div className="text-gray-700 ">
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
                            setSelectedButton(null);
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
                            setSelectedButton(null);
                            try {
                              const response = await axios.put(
                                `http://localhost:8006/leads/${props.id}`,
                                updatedData,
                                {
                                  headers: {
                                    Authorization: `Bearer ${LocalStore.getAccessToken()}`,
                                  },
                                }
                              );
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
                      <div className="ml-auto pr-6 border rounded-md w-6 border-gray-300 mr-4 bg-gray-200 flex h-6 items-center text-center">
                        <button
                          className="text-center pl-1 hover:text-primary hover:border-primary"
                          onClick={() => {
                            setCurrentTitles([
                              ...currentTitles,
                              titleWithIcon.title,
                            ]);
                            setSelectedButton(titleWithIcon.title);
                          }}
                        >
                          <Icon type="pencil" width={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="pl-5 pr-5 flex flex-col mt-8">
                <div className="text-gray-900 font-bold text-sm flex flex-row gap-2">
                  <div>Lead Status :</div>
                  <LeadStatusIcon status={leadData.status} />
                  <LeadStatusText status={leadData.status} />
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
                <LeadNote />
              </div>

              <div className="flex flex-row justify-between mt-8 pl-6 pr-6 mb-16 text-sm font-extralight text-gray-700">
                <div>Lead ID: {leadData.id}</div>
                <div className="flex flex-row gap-2 text-primary">
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
