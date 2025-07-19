import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Settings, AppSettings } from "./Settings";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onNewAsset: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const menuItems = [
  { id: "date", label: "By Date" },
  { id: "category", label: "By Category" },
  { id: "author", label: "By Author" },
];

export function Header({ currentView, onViewChange, onNewAsset, settings, onSettingsChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img 
              src={settings.logoUrl || "/lovable-uploads/2bea61c1-dc26-490f-a7d0-d31f03dc0406.png"} 
              alt="Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-semibold">{settings.appName}</h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground/10",
                  currentView === item.id && "bg-primary-foreground/20"
                )}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={onNewAsset}
              variant="secondary"
              size="sm"
              className="ml-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Asset
            </Button>
            <Settings settings={settings} onSettingsChange={onSettingsChange} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 py-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground/10 text-left",
                    currentView === item.id && "bg-primary-foreground/20"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  onNewAsset();
                  setIsMobileMenuOpen(false);
                }}
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Asset
              </Button>
              <div className="mt-4">
                <Settings settings={settings} onSettingsChange={onSettingsChange} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}