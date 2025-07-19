import { useState } from "react";
import { Header } from "@/components/Header";
import { AssetForm, Asset } from "@/components/AssetForm";
import { AssetList } from "@/components/AssetList";
import { AppSettings } from "@/components/Settings";

const Index = () => {
  const [currentView, setCurrentView] = useState("date");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [settings, setSettings] = useState<AppSettings>({
    appName: "TeamInova Assets",
    logoUrl: "/lovable-uploads/2bea61c1-dc26-490f-a7d0-d31f03dc0406.png",
    defaultCategories: ["Documents", "Images", "Videos", "Templates", "Reports"],
    authorsList: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"]
  });
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      assetName: "Sample Design Document",
      authorName: "John Doe",
      dateCreated: "2024-01-15T10:30:00",
      category: "Documentation",
      description: "A comprehensive design document for the new project.",
      attachments: [],
      notes: "This is a sample asset to demonstrate the system."
    },
    {
      id: "2",
      assetName: "Project Wireframes",
      authorName: "Jane Smith",
      dateCreated: "2024-01-18T14:20:00",
      category: "Design",
      description: "Initial wireframes for the user interface.",
      attachments: [],
      notes: "Created using Figma, includes mobile and desktop versions."
    }
  ]);
  const [categories, setCategories] = useState(["Documentation", "Design", "Development", "Marketing"]);

  const handleNewAsset = () => {
    setSelectedAsset(undefined);
    setIsFormOpen(true);
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsFormOpen(true);
  };

  const handleSaveAsset = (asset: Asset) => {
    if (asset.id) {
      // Update existing asset
      setAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
    } else {
      // Create new asset
      const newAsset = { ...asset, id: Date.now().toString() };
      setAssets(prev => [...prev, newAsset]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewAsset={handleNewAsset}
        settings={settings}
        onSettingsChange={setSettings}
      />
      
      <main className="container mx-auto px-4 py-6">
        <AssetList
          assets={assets}
          view={currentView}
          onAssetSelect={handleAssetSelect}
        />
      </main>

      <AssetForm
        asset={selectedAsset}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAsset}
        onDelete={handleDeleteAsset}
        defaultCategories={settings.defaultCategories}
        authorsList={settings.authorsList}
      />
    </div>
  );
};

export default Index;
