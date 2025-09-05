-- Create storage bucket for asset attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Create RLS policies for attachments bucket
CREATE POLICY "Users can view their own attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);