
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  eco_points: number | null;
}

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  onInputChange: (field: keyof UserProfile, value: string) => void;
}

const ProfileForm = ({ profile, isEditing, onInputChange }: ProfileFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={profile?.full_name || ''}
          onChange={(e) => onInputChange('full_name', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={profile?.phone || ''}
          onChange={(e) => onInputChange('phone', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
          placeholder="Enter phone number"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={profile?.address || ''}
          onChange={(e) => onInputChange('address', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
          placeholder="Enter street address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={profile?.city || ''}
          onChange={(e) => onInputChange('city', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
          placeholder="Enter city"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={profile?.state || ''}
          onChange={(e) => onInputChange('state', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
          placeholder="Enter state"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postal_code">Postal Code</Label>
        <Input
          id="postal_code"
          value={profile?.postal_code || ''}
          onChange={(e) => onInputChange('postal_code', e.target.value)}
          disabled={!isEditing}
          className="flutter-input"
          placeholder="Enter postal code"
        />
      </div>
    </div>
  );
};

export default ProfileForm;
