import React from "react";
import {
  Dialog,

} from "@/components/ui/dialog";

import CreateLeadForm from "./CreateLeadForm";

type Props = {};

const CreateLead = (props: Props) => {

  return (
    <div className="flex flex-row">
      <Dialog>
        
      <CreateLeadForm/>
      </Dialog>
    </div>
  );
};

export default CreateLead;
