
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  location: z.string().min(5, {
    message: 'Location is required',
  }),
  image: z.instanceof(File).optional(),
  wasteType: z.string().min(1, {
    message: 'Please select the primary waste type',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const wasteTypes = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'batteries', label: 'Batteries' },
  { value: 'mixed', label: 'Mixed e-waste' },
  { value: 'other', label: 'Other hazardous' },
];

// Simulated AI analysis function
const analyzeWasteWithAI = async (image: File | null, description: string, wasteType: string) => {
  // In a real application, this would call an AI API like Google Cloud Vision or Azure Computer Vision
  return new Promise<{severity: string; recommendations: string}>(resolve => {
    setTimeout(() => {
      // Simulated AI response
      const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
      const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      
      let recommendations = '';
      if (wasteType === 'electronics') {
        recommendations = 'Electronics contain heavy metals. Arrange specialized pickup with proper handling procedures.';
      } else if (wasteType === 'batteries') {
        recommendations = 'Batteries pose fire and chemical hazards. Immediate containment and proper disposal required.';
      } else if (severity === 'Critical') {
        recommendations = 'Immediate attention required. Contact environmental authorities for emergency cleanup.';
      } else if (severity === 'High') {
        recommendations = 'Schedule pickup within 24-48 hours. Ensure area is cordoned off to prevent further contamination.';
      } else {
        recommendations = 'Standard pickup procedures can be followed. Educate local community about proper disposal practices.';
      }
      
      resolve({
        severity,
        recommendations
      });
    }, 2000); // Simulate API delay
  });
};

const DumpingReportForm = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<{severity: string; recommendations: string} | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      location: '',
      wasteType: '',
    },
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          form.setValue('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast.success("Location detected successfully");
        },
        () => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    try {
      // In a real app, you might upload the image to a server here
      const aiResult = await analyzeWasteWithAI(
        data.image || null, 
        data.description,
        data.wasteType
      );
      
      setAnalyzeResult(aiResult);
      
      toast.success("Report analyzed successfully", {
        description: `Severity level: ${aiResult.severity}`,
      });
      
      // Here you would save the report to a database in a real application
      console.log("Report data:", {
        ...data,
        severity: aiResult.severity,
        recommendations: aiResult.recommendations,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error analyzing report:", error);
      toast.error("Error analyzing report");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="flutter-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          Report Illegal E-Waste Dumping
        </CardTitle>
        <CardDescription>
          Use AI to analyze illegal e-waste dumping sites and determine appropriate action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of the Dumping Site</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the e-waste site and any visible hazards" 
                          className="flutter-input min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wasteType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Waste Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="flutter-input">
                            <SelectValue placeholder="Select waste type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wasteTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="GPS coordinates" 
                            className="flutter-input" 
                            {...field} 
                            readOnly 
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={getLocation}
                          className="flutter-button-secondary"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Detect
                        </Button>
                      </div>
                      <FormDescription>
                        Click "Detect" to use your current location or enter coordinates manually
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Upload Image (Optional)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flutter-input mt-1"
                  />
                  <FormDescription>
                    Upload an image of the dumping site for AI analysis
                  </FormDescription>
                </div>
              </div>

              <div>
                {imagePreview ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium">Image Preview:</p>
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                      <img 
                        src={imagePreview} 
                        alt="Dumping site preview" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-muted-foreground">
                    <div className="text-center">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Upload an image of the illegal dumping site for AI analysis</p>
                      <p className="text-sm mt-2">The AI will assess the severity and provide recommendations</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analyzeResult && (
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="font-medium text-lg mb-2">AI Assessment Results:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Severity Level:</p>
                    <div className={`text-lg font-bold mt-1 ${
                      analyzeResult.severity === 'Critical' ? 'text-destructive' :
                      analyzeResult.severity === 'High' ? 'text-orange-500' :
                      analyzeResult.severity === 'Medium' ? 'text-amber-500' :
                      'text-green-500'
                    }`}>
                      {analyzeResult.severity}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recommendations:</p>
                    <p className="mt-1">{analyzeResult.recommendations}</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full flutter-button" 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze & Report Dumping Site'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DumpingReportForm;
