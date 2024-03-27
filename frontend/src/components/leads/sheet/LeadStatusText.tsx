// LeadStatusText.tsx
import React from 'react';
import { LeadsStatus } from "../Leads";

type Props = {
  status: LeadsStatus;
};

const LeadStatusText: React.FC<Props> = ({ status }) => {
  switch (status) {
    case LeadsStatus.INITIAL:
      return <div>Lead</div>;
    case LeadsStatus.PENDING:
    case LeadsStatus.CONFIRMED:
      return <div>Lead in Progress</div>;
    case LeadsStatus.REJECTED:
      return <div>Cancelled</div>;
    case LeadsStatus.COMPLETED:
      return <div>Customer</div>;
    default:
      return null;
  }
};

export default LeadStatusText;