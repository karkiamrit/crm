"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/app/hooks/useAuth";
import Icon from "@/components/Iconlist";
import { LocalStore } from "@/store/localstore";
import {
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const organizationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  file: z.optional(z.instanceof(File))
});

type OrganizationData = z.infer<typeof organizationSchema>;

const CreateOrganizationForm = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const onCreateOrganization = async (data: OrganizationData) => {
    try {
        const formData = new FormData();

        for (const key in data) {
            if (key !== 'file') {
              const value = data[key as keyof OrganizationData];
              if (typeof value === 'string') {
                formData.append(key, value);
              }
            }
          }
        // Append file file to FormData
        if (data.file) {
            formData.append('file', data.file);
          }
      
        console.log(formData)
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${LocalStore.getAccessToken()}`,
                    'Content-Type': 'multipart/form-data', // Ensure correct content type
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            // Handle success
            toast({
                variant: 'default',
                title: 'Organization created successfully.',
            });
            setIsOpen(false);
        } else {
            throw new Error('An error occurred while creating the organization.');
        }
    } catch (err: any) {
        // Handle error
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description:
                err.response?.data?.message ||
                'An error occurred while creating the organization.',
        });
        console.error(
            'An error occurred while creating the organization:',
            err
        );
    }
};


  useEffect(() => {
    // Check user roles if needed
  }, [userData]);

  const organizationCreationForm = useForm<OrganizationData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex flex-row gap-2"
            onClick={() => setIsOpen(true)}
          >
            <Icon type="pencil" width={15} />
            Create new organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create a New Organization Here</DialogTitle>
            <DialogDescription>Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...organizationCreationForm}>
              <form
                onSubmit={organizationCreationForm.handleSubmit(
                  onCreateOrganization
                )}
                className="mt-4 space-y-4"
              >
                <div className="flex flex-row gap-2">
                  <FormField
                    control={organizationCreationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Organization Name *"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={organizationCreationForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Organization Email *"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <FormField
                    control={organizationCreationForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Organization Address *"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={organizationCreationForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Organization Phone *"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={organizationCreationForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/gif, image/webp"
                          onChange={(e) => {
                            if (e.target.files) {
                              const file = e.target.files[0];
                              field.onChange(file);
                            }
                          }}
                          placeholder="Logo"
                          className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
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
                    Create Organization
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateOrganizationForm;
