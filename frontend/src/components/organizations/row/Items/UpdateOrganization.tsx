import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { LocalStore } from "@/store/localstore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Organization } from "../../Organization";
// import Icon from "@/components/icons";
import useOrganizationFormSubmitted from "@/store/organizationFormSubmitted";

interface Props {
  id: number;
  email: string;
  phone: string;
  address: string;
  //   hasAdminRole: boolean | undefined;
}

const UpdateOrganizationForm = ({ id, email, phone, address }: Props) => {
  const { setOrganizationFormSubmitted } = useOrganizationFormSubmitted();
  
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const onUpdateOrganization = async (data: Organization) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Handle success
        setOrganizationFormSubmitted(true);
        toast({
          variant: "default",
          title: "Organization details updated successfully.",
        });
        setIsOpen(false);
      } else {
        throw new Error(
          "An error occurred while updating organization details."
        );
      }
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message ||
          "An error occurred while updating organization details.",
      });
      console.error("Error updating organization details:", err);
    }
  };
  
  const organizationForm = useForm<Organization>({
    defaultValues: {
      email,
      phone,
      address,
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            onClick={() => setIsOpen(true)}
            className="bg-transparent rounded-full border-none shadow-none"
          >
            {/* <Icon type="pencil" width={15} /> */}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Organization Details</DialogTitle>
            <DialogDescription>
              Update your organization details here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...organizationForm}>
              <form
                onSubmit={organizationForm.handleSubmit(onUpdateOrganization)}
                className="mt-4 space-y-4"
              >
                <FormField
                  control={organizationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={organizationForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={organizationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateOrganizationForm;
