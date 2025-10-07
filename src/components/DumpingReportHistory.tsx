import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

interface DumpingReport {
  id: string;
  description: string;
  location: string;
  waste_type: string;
  severity: string;
  status: string;
  image_url: string | null;
  recommendations: string;
  created_at: string;
}

export const DumpingReportHistory = () => {
  const [reports, setReports] = useState<DumpingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();

    // Set up real-time subscription for status changes
    const channel = supabase
      .channel('dumping-reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dumping_reports'
        },
        (payload) => {
          console.log('Report status updated:', payload);
          const updatedReport = payload.new as DumpingReport;
          
          // Update local state
          setReports(prev => 
            prev.map(report => 
              report.id === updatedReport.id ? updatedReport : report
            )
          );

          // Show alert notification
          const statusMessages = {
            pending: 'Your report is pending review',
            in_progress: 'Action is being taken on your report',
            resolved: 'Your report has been resolved'
          };

          sonnerToast.success('Report Status Updated', {
            description: `${statusMessages[updatedReport.status as keyof typeof statusMessages] || 'Status changed'} - ${updatedReport.waste_type}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('dumping_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load report history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Loading your reports...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>No reports submitted yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Your submitted illegal dumping reports will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Report History</h2>
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {report.waste_type}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {report.location}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getSeverityColor(report.severity)}>
                    {report.severity} severity
                  </Badge>
                  <Badge variant={getStatusColor(report.status)} className="flex items-center gap-1">
                    {getStatusIcon(report.status)}
                    {report.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.image_url && (
                <img
                  src={report.image_url}
                  alt="Dumping site"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-semibold text-sm mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">AI Recommendations</h4>
                <p className="text-sm text-muted-foreground">{report.recommendations}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Reported on {new Date(report.created_at).toLocaleDateString()} at{' '}
                {new Date(report.created_at).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
