import { useState } from "react";
import { Header } from "@/components/Header";
import { AssetForm } from "@/components/AssetForm";
import { AssetList } from "@/components/AssetList";
import { AppSettings } from "@/components/Settings";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAssets, Asset } from "@/hooks/useAssets";
import { Asset as FormAsset } from "@/components/AssetForm";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile } = useProfile();
  const { assets, loading: assetsLoading, saveAsset, deleteAsset } = useAssets();
  
  const [currentView, setCurrentView] = useState("date");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FormAsset | undefined>();
  const [settings, setSettings] = useState<AppSettings>({
    appName: "TeamInova Assets",
    logoUrl: "/lovable-uploads/2bea61c1-dc26-490f-a7d0-d31f03dc0406.png",
    defaultCategories: ["Documents", "Images", "Videos", "Templates", "Reports"],
    defaultCollections: ["Project Alpha", "Marketing", "Development", "Research", "General"],
    authorsList: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"]
  });

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm onSuccess={() => {}} />;
  }

  const handleNewAsset = () => {
    setSelectedAsset(undefined);
    setIsFormOpen(true);
  };

  const handleAssetSelect = (asset: FormAsset) => {
    setSelectedAsset(asset);
    setIsFormOpen(true);
  };

  const handleSaveAsset = async (asset: FormAsset) => {
    // Set default author name if not provided
    const assetWithAuthor = {
      ...asset,
      authorName: asset.authorName || profile?.full_name || "User",
    };
    
    await saveAsset(assetWithAuthor);
    setIsFormOpen(false);
  };

  const handleDeleteAsset = async (id: string) => {
    await deleteAsset(id);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewAsset={handleNewAsset}
        settings={settings}
        onSettingsChange={setSettings}
        user={user}
        onSignOut={signOut}
      />
      
      <main className="container mx-auto px-4 py-6">
        {assetsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div>Loading assets...</div>
          </div>
        ) : (
          <AssetList
            assets={assets}
            view={currentView}
            onAssetSelect={handleAssetSelect}
          />
        )}
      </main>

      <AssetForm
        asset={selectedAsset}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAsset}
        onDelete={handleDeleteAsset}
        defaultCategories={settings.defaultCategories}
        defaultCollections={settings.defaultCollections}
        authorsList={settings.authorsList}
        logoUrl={settings.logoUrl || "/lovable-uploads/2bea61c1-dc26-490f-a7d0-d31f03dc0406.png"}
        defaultAuthorName={profile?.full_name || "User"}
        onAddNewCategory={(category) => {
          if (!settings.defaultCategories.includes(category)) {
            setSettings(prev => ({
              ...prev,
              defaultCategories: [...prev.defaultCategories, category]
            }));
          }
        }}
        onAddNewCollection={(collection) => {
          if (!settings.defaultCollections.includes(collection)) {
            setSettings(prev => ({
              ...prev,
              defaultCollections: [...prev.defaultCollections, collection]
            }));
          }
        }}
        onAddNewAuthor={(author) => {
          if (!settings.authorsList.includes(author)) {
            setSettings(prev => ({
              ...prev,
              authorsList: [...prev.authorsList, author]
            }));
          }
        }}
      />
    </div>
  );
};

export default Index;
