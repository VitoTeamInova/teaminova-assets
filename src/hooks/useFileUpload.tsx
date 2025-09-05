import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, userId: string): Promise<UploadedFile | null> => {
    try {
      setUploading(true);
      
      // Create unique file path: userId/timestamp_originalName
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: filePath
      };

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('attachments')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed", 
        description: error.message || "Failed to delete file",
        variant: "destructive"
      });
      return false;
    }
  };

  const downloadFile = async (filePath: string): Promise<Blob | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(filePath);

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file", 
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    downloadFile,
    uploading
  };
}