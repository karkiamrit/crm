// LeadAvatar.tsx
import React from 'react';
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  name: string;
  imageUrl: string;
};

const LeadAvatar: React.FC<Props> = ({ name, imageUrl }) => (
  <Avatar className="rounded-full w-20 h-20 ">
    <AvatarImage src={imageUrl} className="rounded-full grayscale" />
    <AvatarFallback>
      {name.split(" ")[0][0].toUpperCase()}
      {name.split(" ")[1] ? name.split(" ")[1][0].toUpperCase() : ""}
    </AvatarFallback>
  </Avatar>
);

export default LeadAvatar;