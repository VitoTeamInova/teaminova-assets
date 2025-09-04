import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { X, Save, Edit, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export interface Asset {
  id?: string;
  assetName: string;
  collection: string;
  authorName: string;
  dateCreated: string;
  category: string;
  description?: string;
  attachments: File[];
  notes?: string;
}

interface AssetFormProps {
  asset?: Asset;
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  onDelete?: (id: string) => void;
  defaultCategories: string[];
  defaultCollections: string[];
  authorsList: string[];
  logoUrl?: string;
  defaultAuthorName?: string;
  onAddNewCategory?: (category: string) => void;
  onAddNewCollection?: (collection: string) => void;
  onAddNewAuthor?: (author: string) => void;
}

export function AssetForm({ 
  asset, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  defaultCategories,
  defaultCollections,
  authorsList,
  logoUrl,
  defaultAuthorName,
  onAddNewCategory,
  onAddNewCollection,
  onAddNewAuthor
}: AssetFormProps) {
  const [formData, setFormData] = useState<Asset>({
    assetName: "",
    collection: "",
    authorName: "",
    dateCreated: new Date().toISOString(),
    category: "",
    description: "",
    attachments: [],
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (asset) {
      setFormData(asset);
      setIsEditing(false);
    } else {
      setFormData({
        assetName: "",
        collection: "",
        authorName: defaultAuthorName || "",
        dateCreated: new Date().toISOString(),
        category: "",
        description: "",
        attachments: [],
        notes: "",
      });
      setIsEditing(true);
    }
  }, [asset, defaultAuthorName]);

  const handleSave = () => {
    if (!formData.assetName.trim() || !formData.collection.trim() || !formData.authorName.trim() || !formData.category.trim()) {
      toast({
        title: "Validation Error",
        description: "Asset Name, Collection, Author Name, and Category are required.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: asset ? "Asset updated successfully." : "Asset created successfully.",
    });
  };

  const handleDelete = () => {
    if (asset?.id && onDelete) {
      onDelete(asset.id);
      onClose();
      toast({
        title: "Success",
        description: "Asset deleted successfully.",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleCategorySelect = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  if (!isOpen) return null;

  const isNewAsset = !asset;
  const canEdit = isNewAsset || isEditing;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="bg-accent/20 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
              )}
              <CardTitle className="text-primary">
                {isNewAsset ? "New Asset" : isEditing ? "Edit Asset" : "Asset Details"}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assetName">Asset Name *</Label>
            <Input
              id="assetName"
              value={formData.assetName}
              onChange={(e) => setFormData(prev => ({ ...prev, assetName: e.target.value }))}
              maxLength={200}
              disabled={!canEdit}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="collection">Collection *</Label>
            <Combobox
              options={defaultCollections}
              value={formData.collection}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, collection: value }));
                // If it's a new collection, add it to the list
                if (value && !defaultCollections.includes(value) && onAddNewCollection) {
                  onAddNewCollection(value);
                }
              }}
              placeholder="Select or enter collection"
              searchPlaceholder="Search collections..."
              disabled={!canEdit}
              className="mt-1 w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateCreated">Date Created</Label>
              <Input
                id="dateCreated"
                type="datetime-local"
                value={formData.dateCreated.slice(0, 16)}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="authorName">Author Name *</Label>
              <Combobox
                options={authorsList}
                value={formData.authorName}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, authorName: value }));
                  // If it's a new author, add it to the list
                  if (value && !authorsList.includes(value) && onAddNewAuthor) {
                    onAddNewAuthor(value);
                  }
                }}
                placeholder="Select or enter author name"
                searchPlaceholder="Search authors..."
                disabled={!canEdit}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Combobox
                options={defaultCategories}
                value={formData.category}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }));
                  // If it's a new category, add it to the list
                  if (value && !defaultCategories.includes(value) && onAddNewCategory) {
                    onAddNewCategory(value);
                  }
                }}
                placeholder="Select or enter category"
                searchPlaceholder="Search categories..."
                disabled={!canEdit}
                className="mt-1 w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label>Attachments</Label>
            {canEdit && (
              <div className="mt-1">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </label>
                </Button>
              </div>
            )}
            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <div className="mt-1">
              <RichTextEditor
                value={formData.notes || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                disabled={!canEdit}
                showToolbar={canEdit}
                placeholder="Add rich text notes with formatting and more..."
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {!isNewAsset && !isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!isNewAsset && canEdit && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to delete "{formData.assetName}". Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {canEdit && (
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}