import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings as SettingsIcon, Upload, Plus, X } from "lucide-react";

export interface AppSettings {
  appName: string;
  logoUrl: string;
  defaultCategories: string[];
  authorsList: string[];
}

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function Settings({ settings, onSettingsChange }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const addCategory = () => {
    if (newCategory.trim() && !localSettings.defaultCategories.includes(newCategory.trim())) {
      setLocalSettings({
        ...localSettings,
        defaultCategories: [...localSettings.defaultCategories, newCategory.trim()]
      });
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    const updated = localSettings.defaultCategories.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, defaultCategories: updated });
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !localSettings.authorsList.includes(newAuthor.trim())) {
      setLocalSettings({
        ...localSettings,
        authorsList: [...localSettings.authorsList, newAuthor.trim()]
      });
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    const updated = localSettings.authorsList.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, authorsList: updated });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              value={localSettings.appName}
              onChange={(e) => setLocalSettings({ ...localSettings, appName: e.target.value })}
              placeholder="Enter application name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <div className="flex gap-2">
              <Input
                id="logoUrl"
                value={localSettings.logoUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, logoUrl: e.target.value })}
                placeholder="Enter logo URL or path"
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Default Categories</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  onKeyPress={(e) => handleKeyPress(e, addCategory)}
                />
                <Button onClick={addCategory} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                {localSettings.defaultCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                    <span className="text-sm">{category}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {localSettings.defaultCategories.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No categories added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Authors List</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Enter new author"
                  onKeyPress={(e) => handleKeyPress(e, addAuthor)}
                />
                <Button onClick={addAuthor} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                {localSettings.authorsList.map((author, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                    <span className="text-sm">{author}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAuthor(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {localSettings.authorsList.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No authors added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}