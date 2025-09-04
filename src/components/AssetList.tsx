import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Asset } from "./AssetForm";
import { cn } from "@/lib/utils";

interface AssetListProps {
  assets: Asset[];
  view: string;
  onAssetSelect: (asset: Asset) => void;
}

type SortField = "assetName" | "authorName" | "dateCreated" | "category";
type SortDirection = "asc" | "desc";

export function AssetList({ assets, view, onAssetSelect }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [jumpToChar, setJumpToChar] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter((asset) =>
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (jumpToChar) {
      const jumpField = view === "author" ? "authorName" : 
                      view === "category" ? "category" : 
                      view === "collection" ? "collection" : "assetName";
      filtered = filtered.filter((asset) =>
        asset[jumpField].toLowerCase().startsWith(jumpToChar.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      if (sortField === "dateCreated") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [assets, searchTerm, sortField, sortDirection, jumpToChar, view]);

  const groupedAssets = useMemo(() => {
    if (view === "category") {
      const groups: { [key: string]: Asset[] } = {};
      filteredAndSortedAssets.forEach((asset) => {
        const category = asset.category || "Uncategorized";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(asset);
      });
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    } else if (view === "collection") {
      const groups: { [key: string]: Asset[] } = {};
      filteredAndSortedAssets.forEach((asset) => {
        const collection = asset.collection || "Uncategorized";
        if (!groups[collection]) {
          groups[collection] = [];
        }
        groups[collection].push(asset);
      });
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    } else if (view === "author") {
      const groups: { [key: string]: Asset[] } = {};
      filteredAndSortedAssets.forEach((asset) => {
        const author = asset.authorName || "Unknown";
        if (!groups[author]) {
          groups[author] = [];
        }
        groups[author].push(asset);
      });
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }
    return null;
  }, [filteredAndSortedAssets, view]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === "asc" ? 
        <SortAsc className="w-3 h-3 ml-1" /> : 
        <SortDesc className="w-3 h-3 ml-1" />
      )}
    </Button>
  );

  const AssetRow = ({ asset, index }: { asset: Asset; index: number }) => (
    <div
      key={asset.id}
      onClick={() => onAssetSelect(asset)}
      className={cn(
        "grid grid-cols-5 gap-4 p-3 hover:bg-muted/50 cursor-pointer border-b border-border",
        index % 2 === 0 ? "bg-accent/10" : "bg-muted/20"
      )}
    >
      {view === "date" && (
        <>
          <div className="text-sm">{new Date(asset.dateCreated).toLocaleDateString()}</div>
          <div className="font-medium">{asset.assetName}</div>
          <div className="text-sm text-muted-foreground">{asset.collection}</div>
          <div className="text-sm text-muted-foreground">{asset.authorName}</div>
          <div className="text-sm">{asset.category}</div>
        </>
      )}
      {view === "category" && (
        <>
          <div className="text-sm">{asset.category}</div>
          <div className="text-sm">{new Date(asset.dateCreated).toLocaleDateString()}</div>
          <div className="font-medium">{asset.assetName}</div>
          <div className="text-sm text-muted-foreground">{asset.collection}</div>
          <div className="text-sm text-muted-foreground">{asset.authorName}</div>
        </>
      )}
      {view === "collection" && (
        <>
          <div className="text-sm">{asset.collection}</div>
          <div className="text-sm">{new Date(asset.dateCreated).toLocaleDateString()}</div>
          <div className="font-medium">{asset.assetName}</div>
          <div className="text-sm text-muted-foreground">{asset.authorName}</div>
          <div className="text-sm">{asset.category}</div>
        </>
      )}
      {view === "author" && (
        <>
          <div className="text-sm text-muted-foreground">{asset.authorName}</div>
          <div className="text-sm">{new Date(asset.dateCreated).toLocaleDateString()}</div>
          <div className="font-medium">{asset.assetName}</div>
          <div className="text-sm text-muted-foreground">{asset.collection}</div>
          <div className="text-sm">{asset.category}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Jump to..."
            value={jumpToChar}
            onChange={(e) => setJumpToChar(e.target.value)}
            className="w-24"
            maxLength={1}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setJumpToChar("")}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Asset List */}
      <Card>
        <CardContent className="p-0">
          {/* Headers */}
          <div className="grid grid-cols-5 gap-4 p-3 bg-muted/30 border-b border-border font-medium text-sm">
            {view === "date" && (
              <>
                <SortButton field="dateCreated">Date Created</SortButton>
                <SortButton field="assetName">Asset Name</SortButton>
                <div className="font-medium">Collection</div>
                <SortButton field="authorName">Author Name</SortButton>
                <SortButton field="category">Category</SortButton>
              </>
            )}
            {view === "category" && (
              <>
                <SortButton field="category">Category</SortButton>
                <SortButton field="dateCreated">Date Created</SortButton>
                <SortButton field="assetName">Asset Name</SortButton>
                <div className="font-medium">Collection</div>
                <SortButton field="authorName">Author Name</SortButton>
              </>
            )}
            {view === "collection" && (
              <>
                <div className="font-medium">Collection</div>
                <SortButton field="dateCreated">Date Created</SortButton>
                <SortButton field="assetName">Asset Name</SortButton>
                <SortButton field="authorName">Author Name</SortButton>
                <SortButton field="category">Category</SortButton>
              </>
            )}
            {view === "author" && (
              <>
                <SortButton field="authorName">Author Name</SortButton>
                <SortButton field="dateCreated">Date Created</SortButton>
                <SortButton field="assetName">Asset Name</SortButton>
                <div className="font-medium">Collection</div>
                <SortButton field="category">Category</SortButton>
              </>
            )}
          </div>

          {/* Asset Rows */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {view === "date" && filteredAndSortedAssets.map((asset, index) => (
              <AssetRow key={asset.id} asset={asset} index={index} />
            ))}

            {(view === "category" || view === "collection" || view === "author") && groupedAssets?.map(([groupName, groupAssets]) => {
              const isExpanded = expandedCategories.has(groupName);
              return (
                <div key={groupName}>
                  <div
                    onClick={() => toggleCategory(groupName)}
                    className="flex items-center p-3 bg-muted/20 hover:bg-muted/40 cursor-pointer border-b border-border"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-medium">{groupName}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({groupAssets.length})</span>
                  </div>
                  {isExpanded && groupAssets.map((asset, index) => (
                    <AssetRow key={asset.id} asset={asset} index={index} />
                  ))}
                </div>
              );
            })}

            {filteredAndSortedAssets.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No assets found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}