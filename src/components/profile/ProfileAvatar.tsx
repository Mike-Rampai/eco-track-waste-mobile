
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon } from 'lucide-react';

interface UserProfile {
  full_name: string | null;
  avatar_url: string | null;
  eco_points: number | null;
}

interface ProfileAvatarProps {
  profile: UserProfile;
  userEmail?: string;
}

const ProfileAvatar = ({ profile, userEmail }: ProfileAvatarProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.avatar_url || ''} />
        <AvatarFallback>
          <UserIcon className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{profile?.full_name || 'No name set'}</h3>
        <p className="text-sm text-muted-foreground">{userEmail}</p>
        <p className="text-sm text-primary font-medium">
          {profile?.eco_points || 0} Eco Points
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
