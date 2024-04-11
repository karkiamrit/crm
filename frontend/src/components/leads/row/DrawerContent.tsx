import * as React from "react";

import { Button } from "@/components/ui/button";

export default function DrawerContentDemo() {
  return (
    <div className="flex justify-between mx-10">
      <div className="flex gap-3 ">
        <div className="bg-transparent text-black">1 Selected</div>
        <div className="text-primary underline underline-offset-2 underline-primary">Clear All</div>
      </div>

      <Button className="w-60 my-2 px-4">Segment</Button>
    </div>
  );
}
