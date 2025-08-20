
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollectionRequestTracker from '@/components/CollectionRequestTracker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Check, Truck } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Define form schema
const formSchema = z.object({
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  zipCode: z.string().min(4, { message: 'Valid zip code is required.' }),
  date: z.date({
    required_error: "Please select a date for collection.",
  }),
  timeSlot: z.string().min(1, { message: 'Please select a time slot.' }),
  itemCount: z.string().min(1, { message: 'Please specify the number of items.' }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Time slots available for collection
const timeSlots = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

const CollectionRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      city: '',
      zipCode: '',
      timeSlot: '',
      itemCount: '1',
      notes: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a collection request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert time slot to a proper timestamp
      const [startTime] = values.timeSlot.split(' - ');
      const [hours, minutes] = startTime.split(':').map(Number);
      const scheduledDate = new Date(values.date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from('collection_requests')
        .insert({
          user_id: user.id,
          address: values.address,
          city: values.city,
          postal_code: values.zipCode,
          state: 'N/A', // You can add a state field to the form if needed
          scheduled_date: scheduledDate.toISOString(),
          notes: values.notes || null,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Collection request submitted!",
        description: `Your pickup is scheduled for ${format(values.date, 'PPPP')} between ${values.timeSlot}.`,
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting collection request:', error);
      toast({
        title: "Request failed",
        description: "There was an error submitting your collection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flutter-text-gradient">E-Waste Collection</h1>
        <p className="text-muted-foreground">Schedule pickups and track your collection requests</p>
      </div>

      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">New Request</TabsTrigger>
          <TabsTrigger value="track">Track Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request" className="mt-6">
          <Card className="flutter-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Schedule E-Waste Collection</CardTitle>
              <CardDescription>
                Provide your pickup details and we'll come collect your e-waste items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* ... keep existing code (form fields) */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Pickup Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input className="flutter-input" placeholder="123 Main St, Apt 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input className="flutter-input" placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input className="flutter-input" placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Collection Date & Time
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Collection Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "flutter-input w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Select date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    // Disable past dates and Sundays
                                    return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                                           date.getDay() === 0
                                  }}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              We collect Mon-Sat, excluding holidays.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="flutter-input">
                                  <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {slot}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              All times are in your local timezone.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Collection Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="itemCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Items to Collect</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="flutter-input">
                                  <SelectValue placeholder="Select item count" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((count) => (
                                  <SelectItem key={count} value={count}>{count}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How many e-waste items do you have for collection?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="flutter-input min-h-[100px]" 
                                placeholder="Any special instructions for pickup? E.g., 'Items are heavy', 'Located at back entrance', etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full flutter-button" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <span className="animate-spin mr-2">●</span>
                          Submitting Request...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-2" />
                          Schedule Collection
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="track" className="mt-6">
          <CollectionRequestTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectionRequest;
