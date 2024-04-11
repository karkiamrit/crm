import * as React from "react";

import { Button } from "@/components/ui/button";

export default function DrawerContentDemo() {
  return (
    <div className="flex justify-between mx-10 items-center my-6">
      <div className="flex gap-3  items-center">
        <div className="bg-transparent text-black">1 Selected</div>
        <Button className="text-primary bg-transparent hover:bg-transparent shadow-none   underline underline-offset-2 underline-primary">
          Clear All
        </Button>
      </div>
      <Button className="w-60 my-2 px-4">Segment</Button>
    </div>
  );
}
