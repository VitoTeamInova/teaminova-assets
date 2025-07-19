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
    // Update the local state with the raw value for display
    setLocalSettings({ 
      ...localSettings, 
      defaultCategories: value.split(/[\r\n,]+/).map(cat => cat.trim()).filter(cat => cat.length > 0)
    });
  };

  const handleAuthorsChange = (value: string) => {
    // Update the local state with the raw value for display
    setLocalSettings({ 
      ...localSettings, 
      authorsList: value.split(/[\r\n,]+/).map(author => author.trim()).filter(author => author.length > 0)
    });
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
            <Label htmlFor="categories">Default Categories</Label>
            <p className="text-sm text-muted-foreground">Enter categories separated by new lines or commas</p>
            <Textarea
              id="categories"
              value={localSettings.defaultCategories.join('\n')}
              onChange={(e) => handleCategoriesChange(e.target.value)}
              placeholder="Documents&#10;Images&#10;Videos&#10;Templates&#10;Reports&#10;&#10;Or use commas: Documents, Images, Videos"
              rows={6}
              className="resize-none font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authors">Authors List</Label>
            <p className="text-sm text-muted-foreground">Enter author names separated by new lines or commas</p>
            <Textarea
              id="authors"
              value={localSettings.authorsList.join('\n')}
              onChange={(e) => handleAuthorsChange(e.target.value)}
              placeholder="John Doe&#10;Jane Smith&#10;Mike Johnson&#10;&#10;Or use commas: John Doe, Jane Smith, Mike Johnson"
              rows={6}
              className="resize-none font-mono"
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