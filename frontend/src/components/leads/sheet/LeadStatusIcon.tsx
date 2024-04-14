// LeadStatusIcon.tsx
import React from 'react';
import Icon from "@/components/Iconlist";
import { LeadsStatus } from "../Leads";

type Props = {
  status: LeadsStatus;
};

const LeadStatusIcon: React.FC<Props> = ({ status }) => {
  switch (status) {
    case LeadsStatus.INITIAL:
      return <Icon type="play" height={20} width={20} color="violet" />;
    case LeadsStatus.PENDING:
    case LeadsStatus.CONFIRMED:
      return <Icon type="play" height={20} width={20} color="blue" />;
    case LeadsStatus.REJECTED:
      return <Icon type="play" height={20} width={20} color="red" />;
    case LeadsStatus.COMPLETED:
      return <Icon type="check" height={20} width={20} color="green" />;
    default:
      return null;
  }
};

export default LeadStatusIcon;