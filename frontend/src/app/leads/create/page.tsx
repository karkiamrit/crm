"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  div,
  FormMessage,
} from "@/components/ui/form";

import { LeadsStatus } from "@/components/leads/Leads";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import useleadFormSubmitted from "@/store/leadFormSubmitted";
import { BreadcrumbDemo } from "@/components/Breadcrumb/Breadcrumb";
const leadSchema = z.object({
  address: z.string().min(1).max(255).optional(),
  details: z.string().max(255).optional(),
  status: z.nativeEnum(LeadsStatus).optional(),
  phone: z.string().min(1).max(20).optional(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  priority: z.number().int().min(1).max(5).optional(),
  source: z.string().max(255).optional(),
  product: z
    .object({
      name: z.string().max(255).optional(),
    })
    .optional(),
  service: z
    .object({
      name: z.string().max(255).optional(),
    })
    .optional(),
  documents: z.array(z.instanceof(File)).optional(),
  referenceNo: z.string().max(50).optional(),
});

type LeadData = z.infer<typeof leadSchema> & { [key: string]: any };

const Page = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { setLeadFormSubmitted } = useleadFormSubmitted();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const onCreateLead = async (data: LeadData) => {
    const formData = new FormData();
    for (const key in data) {
      if (key !== "documents") {
        if (key === "priority") {
          if (data[key] !== undefined) {
            formData.append(key, Number(data[key]).toString());
          }
        } else if (key === "product" || key === "service") {
          // If product or service is an object, handle nested properties
          if (typeof data[key] === "object" && data[key] !== null) {
            const nestedData = data[key] as { name?: string | undefined };
            if (nestedData.name !== undefined) {
              formData.append(`${key}[name]`, nestedData.name); // append the name property nested within product or service
            }
          }
        } else {
          formData.append(key, data[key]);
        }
      }
    }
    // Append files
    if (data.documents) {
      data.documents.forEach((file, index) => {
        formData.append("documents", file, file.name);
      });
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/leads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setLeadFormSubmitted(true);
        setIsOpen(false);
        leadCreationForm.reset();
      } else {
        throw new Error("An error occurred while creating the lead.");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          `${
            err.response?.data?.message ||
            "An error occurred while creating the lead."
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
      console.error("An error occurred while creating the lead:", err);
    }
  };

  useEffect(() => {
    const hasAdminRole = userData?.roles?.some((role) => role.name === "Admin");
    console.log(isAdmin);
    setIsAdmin(hasAdminRole ?? false);
  }, [userData]);

  const leadCreationForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      email: "",
      details: "",
      address: "",
      phone: "",
      source: "",
      name: "",
      referenceNo: "",
      documents: [],
    },
  });
  return (
    <div className="px-6 mx-auto sm:px-6 lg:px-10 flex flex-col justify-start">
      <h1 className="text-3xl w-full font-bold my-2 text-gray-900">Add Lead</h1>
      <BreadcrumbDemo />
      <div className="grid gap-4 py-4">
        <Form {...leadCreationForm}>
          <form
            onSubmit={leadCreationForm.handleSubmit(onCreateLead)}
            className="mt-4 space-y-4"
          >
            <div className="flex flex-col gap-2">
              {" "}
              <FormField
                control={leadCreationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="font-bold text-md mt-5 w-[10%]">
                      Email Address
                    </div>
                    <div className="flex flex-col w-2/3">
                      <FormControl>
                        <Input
                          placeholder="Email address *"
                          className="border block  px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="font-bold text-md mt-5 w-[10%]">
                      Address
                    </div>
                    <div className="flex flex-col w-2/3">
                      <FormControl>
                        <Input
                          placeholder="Address *"
                          className="border block px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              {" "}
              <FormField
                control={leadCreationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="font-bold text-md mt-5 w-[10%]">
                      Full Name
                    </div>{" "}
                    <div className="flex flex-col w-2/3">
                      <FormControl>
                        <Input
                          placeholder="Name *"
                          className="border block px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="details"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="font-bold text-md mt-5 w-[10%]">
                      Details
                    </div>{" "}
                    <div className="flex flex-col w-2/3">
                      <FormControl>
                        <Input
                          placeholder="Details"
                          className="border block  px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row justify-between w-3/4 gap-6">
              <FormField
                control={leadCreationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <div className="font-bold text-md mt-5 w-[120px]">
                      Phone No
                    </div>
                    <div className="flex flex-col">
                      <FormControl>
                        <Input
                          placeholder="Phone *"
                          className="border block w-[350px]  py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={leadCreationForm.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <div className="font-bold text-md mt-5 w-[74px]">
                      Source
                    </div>{" "}
                    <FormControl>
                      <Input
                        placeholder="Source"
                        className="border block py-3 w-[340px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row w-2/3 gap-6">
              <FormField
                control={leadCreationForm.control}
                name="product.name"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <div className="font-bold text-md mt-5 w-[120px]">
                      Product
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Product"
                        className="border block w-[350px] px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="service.name"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <div className="font-bold text-md mt-5 w-[74px]">
                      Service
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Service"
                        className="border block w-[340px] px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row w-2/3 gap-2">
              {isAdmin ? (
                <>
                  <FormField
                    control={leadCreationForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className="flex w-full">
                        <div className="font-bold text-md mt-5 w-[120px]">
                          Priority
                        </div>
                        <FormControl>
                          <div className="w-[250px]">
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value: any) =>
                                field.onChange(Number(value))
                              }
                            >
                              <SelectTrigger className="lg:w-full h-12">
                                <SelectValue placeholder="Select a priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Priority</SelectLabel>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={leadCreationForm.control}
                    name="referenceNo"
                    render={({ field }) => (
                      <FormItem className="flex w-full">
                        <div className="font-bold text-md mt-5 w-[175px]">
                          Agent Reference No
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Agent Reference No"
                            className="border block w-[360px] px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={leadCreationForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex w-full">
                      <div className="font-bold text-md mt-5 w-[120px]">
                        Priority
                      </div>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value: any) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="lg:w-full h-12">
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Priority</SelectLabel>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={leadCreationForm.control}
              name="documents"
              render={({ field }) => (
                <FormItem className="w-[77%]">
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          field.onChange(files);
                        }
                      }}
                      className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              className="inline-flex items-center justify-center w-[77%] px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
            >
              Create Lead
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
