
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditIcon, SaveIcon } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  saving: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
}

const ProfileHeader = ({ isEditing, saving, onToggleEdit, onSave }: ProfileHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </div>
        <Button
          onClick={isEditing ? onSave : onToggleEdit}
          disabled={saving}
          className="flutter-button"
        >
          {isEditing ? (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </>
          ) : (
            <>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
    </CardHeader>
  );
};

export default ProfileHeader;
