
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, PackageIcon } from 'lucide-react';

// Define form schema
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
  type: z.string({ required_error: 'Please select a device type.' }),
  condition: z.string({ required_error: 'Please select the condition.' }),
  isFree: z.boolean().default(false),
  location: z.string().min(3, { message: 'Location is required.' }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MarketplaceListingFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const MarketplaceListingForm = ({ onSubmit, onCancel }: MarketplaceListingFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      type: 'Mobile',
      condition: 'Good',
      isFree: false,
      location: '',
      imageUrl: '',
    },
  });
  
  // Set price to 0 when isFree is toggled on
  const watchIsFree = form.watch('isFree');
  React.useEffect(() => {
    if (watchIsFree) {
      form.setValue('price', 0);
    }
  }, [watchIsFree, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image to a server
    // Here we're just using local file previews
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          form.setValue('imageUrl', event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleFormSubmit = (values: FormValues) => {
    // If no image was uploaded, use a placeholder
    if (!values.imageUrl) {
      values.imageUrl = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(values.title)}`;
    }
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Title</FormLabel>
              <FormControl>
                <Input className="flutter-input" placeholder="e.g., iPhone 12 Pro Max" {...field} />
              </FormControl>
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
                    <SelectItem value="Mobile">Mobile Phone</SelectItem>
                    <SelectItem value="Computer">Computer/Monitor</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
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
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="flutter-input">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  className="flutter-input min-h-[100px]" 
                  placeholder="Describe your item, including any defects or issues."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input className="flutter-input" placeholder="e.g., Brooklyn, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex flex-row items-center justify-between">
                    <FormLabel>Give Away for Free</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="flutter-input" 
                      placeholder="0.00" 
                      {...field} 
                      disabled={watchIsFree}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 5MB</p>
                  </div>
                  <Button type="button" variant="outline" className="flutter-button" onClick={() => document.getElementById('image-upload')?.click()}>
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="relative rounded-lg overflow-hidden h-[150px] w-full">
                    <img 
                      src={imagePreview}
                      alt="Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flutter-button">
            List Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MarketplaceListingForm;
