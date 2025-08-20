-- Enable real-time for marketplace listings and collection requests
ALTER TABLE public.marketplace_listings REPLICA IDENTITY FULL;
ALTER TABLE public.collection_requests REPLICA IDENTITY FULL;
ALTER TABLE public.e_waste_items REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.e_waste_items;