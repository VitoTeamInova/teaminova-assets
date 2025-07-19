import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings as SettingsIcon, Upload } from "lucide-react";

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

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleCategoriesChange = (value: string) => {
    const categories = value.split('\n').filter(cat => cat.trim().length > 0);
    setLocalSettings({ ...localSettings, defaultCategories: categories });
  };

  const handleAuthorsChange = (value: string) => {
    const authors = value.split('\n').filter(author => author.trim().length > 0);
    setLocalSettings({ ...localSettings, authorsList: authors });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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

          <div className="space-y-2">
            <Label htmlFor="categories">Default Categories (one per line)</Label>
            <Textarea
              id="categories"
              value={localSettings.defaultCategories.join('\n')}
              onChange={(e) => handleCategoriesChange(e.target.value)}
              placeholder="Enter categories, one per line"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authors">Authors List (one per line)</Label>
            <Textarea
              id="authors"
              value={localSettings.authorsList.join('\n')}
              onChange={(e) => handleAuthorsChange(e.target.value)}
              placeholder="Enter author names, one per line"
              rows={5}
            />
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