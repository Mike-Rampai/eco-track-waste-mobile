import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CollectionRequest {
  id: string;
  address: string;
  city: string;
  postal_code: string;
  scheduled_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels = {
  pending: 'Pending Review',
  confirmed: 'Confirmed',
  in_progress: 'Collection in Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const CollectionRequestTracker = () => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('collection_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching collection requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your collection requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('collection-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_requests',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchRequests(); // Refetch when any change occurs to user's requests
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('collection_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Request Cancelled",
        description: "Your collection request has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your collection requests...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-8">
          <CardContent>
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Collection Requests</h3>
            <p className="text-muted-foreground">You haven't submitted any collection requests yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flutter-text-gradient">Your Collection Requests</h2>
        <p className="text-muted-foreground">Track the status of your e-waste collection requests</p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="flutter-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Collection Request #{request.id.slice(-8)}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={statusColors[request.status as keyof typeof statusColors]}
                >
                  {statusLabels[request.status as keyof typeof statusLabels]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {request.address}, {request.city} {request.postal_code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(request.scheduled_date), 'PPP p')}
                  </span>
                </div>
              </div>

              {request.notes && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Submitted {format(new Date(request.created_at), 'PPP')}
                </div>
                
                {request.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelRequest(request.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancel Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollectionRequestTracker;