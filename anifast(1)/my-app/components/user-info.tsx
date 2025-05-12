// components/user-info.tsx
"use client";

import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserInfoProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="bg-[#1F1B3C] p-6 rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar>
          <AvatarImage src={user.image || undefined} />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name || "User"}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full">
          Settings
        </Button>
        <Button variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}