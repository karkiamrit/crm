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
  FormLabel,
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
import { useRouter } from "next/navigation";

const leadSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Address field can't be empty " })
    .max(255)
    .optional(),
  details: z
    .string()
    .min(1, { message: "Address field can't be empty " })
    .max(255)
    .optional(),
  status: z.nativeEnum(LeadsStatus).optional(),
  phone: z
    .string()
    .min(1, { message: "Phone number cannot be empty" })
    .max(20, { message: "can't exceed 20 characters" })
    .optional(),
  email: z.string().email(),
  name: z
    .string()
    .min(1, { message: "Name can't be empty " })
    .max(255)
    .optional(),
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

const LeadCreatePage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { setLeadFormSubmitted } = useleadFormSubmitted();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

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
        router.push("/leads");
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
            className="mt-4 space-y-6"
          >
            <div className="flex flex-row justify-center gap-10">
              <FormField
                control={leadCreationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] peer-placeholder-shown:bg-white bg-white border-gray-300 rounded-lg sm:text-sm peer  placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4  peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Email Address
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] bg-white  border-gray-300 rounded-lg sm:text-sm peer border-b  "
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Address
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base  peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Name
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row justify-center gap-10">
              <FormField
                control={leadCreationForm.control}
                name="details"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Reference No
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Phone
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Source
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row justify-center gap-10">
              <FormField
                control={leadCreationForm.control}
                name="product.name"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Product
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="service.name"
                render={({ field }) => (
                  <FormItem className="flex ">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[250px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Service
                      </FormLabel>
                      <FormMessage className="w-[250px] text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              {/* {isAdmin ? ( */}
              {/* <> */}
              <FormField
                control={leadCreationForm.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex">
                    <div className="flex flex-col w-1/3">
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value: any) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className=" w-[250px] h-12">
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
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row justify-center gap-10 relative mt-5">
              {/* <div className="flex flex-row justify-center gap-10 relative mt-5"> */}
              <FormField
                control={leadCreationForm.control}
                name="referenceNo"
                render={({ field }) => (
                  <FormItem className="flex ">
                    <div className="flex flex-col w-1/3 relative">
                      <FormControl>
                        <Input
                          className="border block px-4 py-3 w-[400px] placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm peer border-b placeholder:text-gray-500 "
                          placeholder=""
                          style={{
                            WebkitBoxShadow: '0 0 0px 1000px white inset',
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 right-0 top-3 -translate-y-5 bg-white ml-3 px-3 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-4 peer-focus:bb-10 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-xs whitespace-nowrap">
                        Reference No
                      </FormLabel>
                      <FormMessage className="w-[250px]" />
                    </div>
                  </FormItem>
                )}
              />
              {/* </div> */}

              <FormField
                control={leadCreationForm.control}
                name="documents"
                render={({ field }) => (
                  <FormItem className="flex">
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
                        className="border block w-[400px] px-4  py-3 placeholder-gray-500 border-gray-300 rounded-md sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="w-[250px]" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="inline-flex items-center justify-center w-full px-6 py-6 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
            >
              Create Lead
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LeadCreatePage;
