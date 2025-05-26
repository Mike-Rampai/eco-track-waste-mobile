
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileForm from '@/components/profile/ProfileForm';
import OfflineModeCard from '@/components/profile/OfflineModeCard';

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

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOffline, startOfflineMode, offlineTimeRemaining } = useOfflineMode();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          id: user?.id!,
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || null,
          eco_points: 0,
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const updateData: any = {
        full_name: profile.full_name,
      };

      // Only include additional fields if they exist in the database schema
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.address !== undefined) updateData.address = profile.address;
      if (profile.city !== undefined) updateData.city = profile.city;
      if (profile.state !== undefined) updateData.state = profile.state;
      if (profile.postal_code !== undefined) updateData.postal_code = profile.postal_code;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-light/10 to-eco-blue-light/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flutter-text-gradient">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <OfflineModeCard 
          isOffline={isOffline}
          offlineTimeRemaining={offlineTimeRemaining}
          onStartOfflineMode={startOfflineMode}
        />

        <Card className="flutter-card">
          <ProfileHeader 
            isEditing={isEditing}
            saving={saving}
            onToggleEdit={handleToggleEdit}
            onSave={handleSave}
          />
          <CardContent className="space-y-6">
            {profile && (
              <>
                <ProfileAvatar profile={profile} userEmail={user?.email} />
                <ProfileForm 
                  profile={profile}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
