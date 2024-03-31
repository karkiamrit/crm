"use client";
import React, { useEffect, useState } from "react";
import {
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
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
  FormMessage,
} from "@/components/ui/form";

import { LeadsStatus } from "../Leads";
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
import Icon from "@/components/icons";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import useleadFormSubmitted from "@/store/leadFormSubmitted";

const leadSchema = z.object({
  address: z.string(),
  details: z.string().optional(),
  status: z.nativeEnum(LeadsStatus).optional(),
  phone: z.string(),
  email: z.string().email(),
  name: z.string(),
  priority: z.number().int().min(1).max(5).optional(),
  source: z.string().optional(),
  product: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  service: z.object({
    name: z.string().optional(),
  }),
  documents: z.array(z.instanceof(File)).optional(),
  referenceNo: z.string().optional(),
});
type LeadData = z.infer<typeof leadSchema> & { [key: string]: any };

const CreateLeadForm = () => {
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
              formData.append(`${key}.name`, nestedData.name);
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
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:8006/leads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Lead created successfully");
        setLeadFormSubmitted(true);
        setIsOpen(false); 
        leadCreationForm.reset();
      } else {
        throw new Error("An error occurred while creating the lead.");
      }
    } catch (err:any) {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex flex-row gap-2"
          onClick={()=>setIsOpen(true)}
        >
          <Icon type="pencil" width={15} />
          Create new lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Lead Here</DialogTitle>
          <DialogDescription>Click save when youre done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...leadCreationForm}>
            <form
              onSubmit={leadCreationForm.handleSubmit(onCreateLead)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={leadCreationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email address *"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address *"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Details"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone *"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={leadCreationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name *"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2">
                <FormField
                  control={leadCreationForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value: any) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="w-[180px] h-12">
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
                <FormField
                  control={leadCreationForm.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Source"
                          className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={leadCreationForm.control}
                name="product.name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Product"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
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
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Service"
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAdmin && (
                <FormField
                  control={leadCreationForm.control}
                  name="referenceNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Agent Reference No"
                          className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={leadCreationForm.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
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
              <DialogFooter>
                  <Button
                    type="submit"
                    variant="default"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
                  >
                    Create Lead
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadForm;
