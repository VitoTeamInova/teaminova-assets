import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DatabaseAsset {
  id: string;
  user_id: string;
  asset_name: string;
  collection: string;
  author_name: string;
  date_created: string;
  category: string;
  description?: string;
  attachments: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  assetName: string;
  collection: string;
  authorName: string;
  dateCreated: string;
  category: string;
  description?: string;
  attachments: any[];
  notes?: string;
}

export const useAssets = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssets = async () => {
    if (!user) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Convert database format to form format
      const formattedAssets = (data || []).map((dbAsset: any) => ({
        id: dbAsset.id,
        assetName: dbAsset.asset_name,
        collection: dbAsset.collection || "",
        authorName: dbAsset.author_name,
        dateCreated: dbAsset.date_created,
        category: dbAsset.category,
        description: dbAsset.description || "",
        attachments: Array.isArray(dbAsset.attachments) ? dbAsset.attachments : [],
        notes: dbAsset.notes || "",
      }));
      
      setAssets(formattedAssets);
    } catch (error: any) {
      console.error("Error fetching assets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assets",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user]);

  const saveAsset = async (asset: Partial<Asset>) => {
    if (!user) return;

    try {
      if (asset.id) {
        // Update existing asset
        const { error } = await supabase
          .from("assets")
          .update({
            asset_name: asset.assetName,
            collection: asset.collection,
            author_name: asset.authorName,
            date_created: asset.dateCreated,
            category: asset.category,
            description: asset.description,
            attachments: asset.attachments,
            notes: asset.notes,
          })
          .eq("id", asset.id)
          .eq("user_id", user.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        // Create new asset
        const { error } = await supabase
          .from("assets")
          .insert({
            user_id: user.id,
            asset_name: asset.assetName!,
            collection: asset.collection!,
            author_name: asset.authorName!,
            date_created: asset.dateCreated!,
            category: asset.category!,
            description: asset.description,
            attachments: asset.attachments || [],
            notes: asset.notes,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Asset created successfully",
        });
      }

      // Refresh assets list
      await fetchAssets();
    } catch (error: any) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save asset",
      });
    }
  };

  const deleteAsset = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("assets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });

      // Refresh assets list
      await fetchAssets();
    } catch (error: any) {
      console.error("Error deleting asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete asset",
      });
    }
  };

  return {
    assets,
    loading,
    saveAsset,
    deleteAsset,
    refreshAssets: fetchAssets,
  };
};