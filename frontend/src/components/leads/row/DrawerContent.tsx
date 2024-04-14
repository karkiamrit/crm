import * as React from "react";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import { useSelectedLeadsStore } from "@/store/useSelectedLeadsStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  leadID: number[];
}

export default function DrawerContentDemo({ leadID }: Props) {
  const { toast } = useToast();
  const { setSelectedLeads } = useSelectedLeadsStore();
  const handleSegement = async (data: number[]) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/segments`,
        { leads: data, name: "My Segment", description: "my leads" },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      );

      if (response.status >= 200 || response.status <= 300) {
        // Handle success
        toast({
          variant: "default",
          title: "Segment created successfully.",
        });
      } else {
        throw new Error("An error occurred while creating the segment.");
      }
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message ||
          "An error occurred while creating the segment.",
      });
      console.error("An error occurred while creating the segment:", err);
    }
  };

  const leadcount = leadID.length;

  return (
    <div className="flex justify-between mx-10 items-center my-1 ">
      <div className="flex gap-3  items-center">
        <div className="bg-transparent text-black">{leadcount} Selected</div>
        <Button
          className="text-primary bg-transparent hover:bg-transparent shadow-none   underline underline-offset-2 underline-primary"
          onClick={() => {
            setSelectedLeads([]);
          }}
        >
          Clear All
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="w-60 my-2 px-4"
            onClick={() => {
              handleSegement(leadID);
            }}
          >
            Create Segment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input
                  id="maxHeight"
                  defaultValue="none"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
