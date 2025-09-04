-- Add collection column to assets table
ALTER TABLE public.assets 
ADD COLUMN collection TEXT;