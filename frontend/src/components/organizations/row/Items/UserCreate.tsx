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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserCreated from "@/store/useUserCreated";

export enum Status {
  Live = "LIVE",
  Blocked = "BLOCKED",
  Deactivated = "DEACTIVATED",
  Pending = "PENDING",
}

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  roles: z.array(z.object({ id: z.number(), name: z.string() })),
  status: z.nativeEnum(Status),
});

type UserData = z.infer<typeof userSchema>;

const CreateUserForm = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { setUserCreated } = useUserCreated();

  const onCreateUser = async (data: UserData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/users/create`,
        {...data, organizationId: userData?.organizationId},
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );

      if (response.status === 201) {
        // Handle success
        toast({
          variant: "default",
          title: "User created successfully.",
        });
        setIsOpen(false);
        setUserCreated(true);
        userCreationForm.reset();
      } else {
        throw new Error("An error occurred while creating the user.");
      }
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message ||
          "An error occurred while creating the user.",
      });
      console.error("Error creating user:", err);
    }
  };

  useEffect(() => {
    // Check user roles if needed
  }, [userData]);

  const userCreationForm = useForm<UserData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      roles: [],
      status: Status.Live,

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
            Create new user
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create a New User Here</DialogTitle>
            <DialogDescription>Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...userCreationForm}>
              <form
                onSubmit={userCreationForm.handleSubmit(onCreateUser)}
                className="mt-4 space-y-4"
              >
                <FormField
                  control={userCreationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="User Email *"
                          className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userCreationForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="User Password *"
                          className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2 ">
                  <FormField
                    control={userCreationForm.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={
                              field.value && field.value.length > 0
                                ? field.value[0].name
                                : ""
                            }
                            onValueChange={(value: any) =>
                              field.onChange([{ id: 1, name: value }])
                            }
                          >
                            <SelectTrigger className="w-[250px] h-12 ">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="User">User</SelectItem>
                              <SelectItem value="Agent">Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userCreationForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: any) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="w-[300px] h-12 ">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Status.Live}>Live</SelectItem>
                              <SelectItem value={Status.Blocked}>
                                Blocked
                              </SelectItem>
                              <SelectItem value={Status.Deactivated}>
                                Deactivated
                              </SelectItem>
                              <SelectItem value={Status.Pending}>
                                Pending
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    variant="default"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
                  >
                    Create User
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

export default CreateUserForm;
