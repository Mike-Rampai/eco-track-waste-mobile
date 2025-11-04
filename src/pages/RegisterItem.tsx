
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Smartphone, Laptop, Monitor, Printer, Check } from 'lucide-react';
import { WasteType } from '@/components/WasteItemCard';
import { supabase } from '@/integrations/supabase/client';

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  type: z.enum(['Mobile', 'Computer', 'Laptop', 'Printer', 'Accessories', 'Other'], {
    required_error: 'Please select a device type.',
  }),
  brand: z.string().min(1, { message: 'Brand is required.' }),
  model: z.string().optional(),
  condition: z.enum(['Working', 'Damaged', 'Not Working'], {
    required_error: 'Please select the condition.',
  }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterItem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'Mobile' as WasteType,
      brand: '',
      model: '',
      condition: 'Working',
      description: '',
      imageUrl: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to register items.",
          variant: "destructive",
        });
        return;
      }

      // Save to e_waste_items table
      const { data: wasteItem, error: wasteError } = await supabase
        .from('e_waste_items')
        .insert({
          user_id: user.id,
          name: values.name,
          category: values.type,
          condition: values.condition,
          description: values.description || null,
          image_url: values.imageUrl || null,
          status: 'registered'
        })
        .select()
        .single();

      if (wasteError) throw wasteError;

      // Also add to marketplace if item is in working or damaged condition
      if (values.condition === 'Working' || values.condition === 'Damaged') {
        const { error: marketplaceError } = await supabase
          .from('marketplace_listings')
          .insert({
            user_id: user.id,
            title: values.name,
            description: values.description || `${values.brand} ${values.model || ''} ${values.type}`.trim(),
            price: 0,
            is_free: true,
            type: values.type,
            condition: values.condition,
            location: 'Not specified',
            image_url: values.imageUrl || null,
            is_available: true
          });

        if (marketplaceError) {
          console.error('Error adding to marketplace:', marketplaceError);
          // Don't fail the whole operation if marketplace listing fails
        }
      }
      
      toast({
        title: "Item registered successfully!",
        description: "Your e-waste item has been added to the system and marketplace.",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error registering item:', error);
      toast({
        title: "Registration failed",
        description: "There was an error registering your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl fade-in">
      <Card className="flutter-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Register E-Waste Item</CardTitle>
          <CardDescription>
            Provide details about the electronic device you want to recycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="details">Item Details</TabsTrigger>
                  <TabsTrigger value="photo">Add Photo</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input className="flutter-input" placeholder="e.g., iPhone 11 Pro" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a descriptive name for your e-waste item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="flutter-input">
                                <SelectValue placeholder="Select device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mobile">
                                <div className="flex items-center">
                                  <Smartphone className="h-4 w-4 mr-2" />
                                  Mobile Phone
                                </div>
                              </SelectItem>
                              <SelectItem value="Computer">
                                <div className="flex items-center">
                                  <Monitor className="h-4 w-4 mr-2" />
                                  Computer/Monitor
                                </div>
                              </SelectItem>
                              <SelectItem value="Laptop">
                                <div className="flex items-center">
                                  <Laptop className="h-4 w-4 mr-2" />
                                  Laptop
                                </div>
                              </SelectItem>
                              <SelectItem value="Printer">
                                <div className="flex items-center">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Printer
                                </div>
                              </SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="flutter-input">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Working">Working</SelectItem>
                              <SelectItem value="Damaged">Damaged</SelectItem>
                              <SelectItem value="Not Working">Not Working</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input className="flutter-input" placeholder="e.g., Apple, Samsung, Dell" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model (Optional)</FormLabel>
                          <FormControl>
                            <Input className="flutter-input" placeholder="e.g., XPS 15, Galaxy S21" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="flutter-input min-h-[120px]" 
                            placeholder="Provide additional details about the condition, any defects, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="photo">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Image (Optional)</FormLabel>
                          <div className="grid grid-cols-1 gap-6">
                            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                              <div className="flex flex-col items-center gap-4">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Drag & drop your image here</p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 5MB</p>
                                </div>
                                <Button type="button" variant="outline" className="flutter-button">
                                  Choose File
                                </Button>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    // This would normally upload the image and set the URL
                                    // Here we're just simulating it
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      // You would upload the file and get a URL back
                                      // field.onChange(url);
                                      
                                      // For demo, we'll just use a placeholder
                                      field.onChange(`https://placehold.co/400x300/e2e8f0/64748b?text=${file.name}`);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            {field.value && (
                              <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Preview:</p>
                                <div className="relative rounded-lg overflow-hidden h-[200px] w-full">
                                  <img 
                                    src={field.value}
                                    alt="Preview" 
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* On a mobile app, this would show the camera */}
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground mb-3">or</p>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flutter-button"
                        onClick={() => {
                          // This would open the camera in a real mobile app
                          toast({
                            title: "Camera feature",
                            description: "In a real mobile app, this would open your device camera.",
                          });
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full flutter-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2">●</span>
                      Registering Item...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Register Item
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterItem;
