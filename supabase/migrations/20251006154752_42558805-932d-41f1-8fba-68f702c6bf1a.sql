-- Create dumping reports table
CREATE TABLE public.dumping_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  waste_type TEXT NOT NULL,
  image_url TEXT,
  severity TEXT NOT NULL,
  recommendations TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dumping_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dumping reports"
  ON public.dumping_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create dumping reports"
  ON public.dumping_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dumping reports"
  ON public.dumping_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_dumping_reports_updated_at
  BEFORE UPDATE ON public.dumping_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();