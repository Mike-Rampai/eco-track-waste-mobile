-- Create marketplace_listings table
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplace listings
CREATE POLICY "Anyone can view available marketplace listings" 
ON public.marketplace_listings 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Users can create their own marketplace listings" 
ON public.marketplace_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace listings" 
ON public.marketplace_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace listings" 
ON public.marketplace_listings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_marketplace_listings_updated_at
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for marketplace listings
ALTER TABLE public.marketplace_listings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_listings;