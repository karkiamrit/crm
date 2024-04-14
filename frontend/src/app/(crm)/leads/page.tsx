"use client";
import LeadsPage from "@/components/leads/Leads";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";

export default function page() {
  return (
    <div>
      <ScrollArea className="h-full">
        <LeadsPage />
      </ScrollArea>
    </div>
  );
}
