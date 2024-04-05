import React, { useState, useRef, ChangeEvent } from "react";
import { LocalStore } from "@/store/localstore";

interface ProfileAvatarProps {
  src: string; // Initial logo URL
  organizationId: number;
}

function ProfileAvatar({ src, organizationId }: ProfileAvatarProps) {
  const [hovered, setHovered] = useState(false);
  const [logoSrc, setLogoSrc] = useState(src); // Use a state to hold the logo URL
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (file: File, organizationId: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_ORGANIZATIONS}/organizations/${organizationId}/update-logo`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${LocalStore.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload the logo.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const updatedOrg = await uploadAvatar(file, organizationId);
      
      // Assuming the server returns the updated organization, including the new logo URL
      // setLogoSrc(updatedOrg.newLogoUrl); // Uncomment and adjust if your server responds with the new logo URL
      
      // For immediate feedback without server confirmation:
      const temporaryUrl = URL.createObjectURL(file);
      setLogoSrc(temporaryUrl);

      alert("Logo updated successfully!");
    } catch (error) {
      console.error("Failed to update logo:", error);
      alert("Failed to update the logo.");
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="w-24 h-24"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={logoSrc} // Use the state for the image source
          alt="Avatar"
          className="w-full h-full rounded-full object-cover"
        />
        {hovered && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex justify-center rounded-full items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-white text-sm text-center">Change Image</span>
          </div>
        )}
      </div>
      <input
        accept="image/jpeg, image/png, image/gif"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  );
}

export default ProfileAvatar;
