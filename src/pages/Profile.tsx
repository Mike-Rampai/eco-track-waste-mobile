
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon, EditIcon, SaveIcon, WifiOffIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOfflineMode } from '@/hooks/useOfflineMode';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  eco_points: number;
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
          phone: null,
          address: null,
          city: null,
          state: null,
          postal_code: null,
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
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postal_code: profile.postal_code,
        })
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

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

        {/* Offline Mode Card */}
        <Card className="flutter-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOffIcon className="h-5 w-5" />
              Offline Mode
            </CardTitle>
            <CardDescription>
              Access limited app features for 15 minutes without internet connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isOffline ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    Offline mode active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Time remaining: {formatTimeRemaining(offlineTimeRemaining)}
                  </p>
                </div>
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${(offlineTimeRemaining / (15 * 60)) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button 
                onClick={startOfflineMode}
                variant="outline"
                className="flutter-button"
              >
                <WifiOffIcon className="h-4 w-4 mr-2" />
                Start Offline Mode
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="flutter-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>
                  <UserIcon className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{profile?.full_name || 'No name set'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium">
                  {profile?.eco_points || 0} Eco Points
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile?.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  className="flutter-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
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
                  onChange={(e) => handleInputChange('address', e.target.value)}
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
                  onChange={(e) => handleInputChange('city', e.target.value)}
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
                  onChange={(e) => handleInputChange('state', e.target.value)}
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
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  disabled={!isEditing}
                  className="flutter-input"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
