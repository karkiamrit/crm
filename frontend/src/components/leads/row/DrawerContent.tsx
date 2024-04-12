import * as React from "react";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { useToast } from "@/components/ui/use-toast";
import { useSelectedLeadsStore } from "@/store/useSelectedLeadsStore";

interface Props {
  leadID: number[];
}

export default function DrawerContentDemo({ leadID,  }: Props) {
  const { toast } = useToast();
  const {setSelectedLeads} = useSelectedLeadsStore();
  const handleSegement = async (data: number[]) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/segments`,
        { leads: data, name: "My Segment" },
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
    <div className="flex justify-between mx-10 items-center my-1 " >
      <div className="flex gap-3  items-center">
        <div className="bg-transparent text-black">{leadcount} Selected</div>
        <Button className="text-primary bg-transparent hover:bg-transparent shadow-none   underline underline-offset-2 underline-primary"
          onClick={() => {
            setSelectedLeads([]);
          }}
        >
          Clear All
        </Button>
      </div>

      <Button
        className="w-60 my-2 px-4"
        onClick={() => {
          handleSegement(leadID);
        }}
      >
        Segment
      </Button>
    </div>
  );
}
