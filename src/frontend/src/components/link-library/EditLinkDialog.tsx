import { useState, useEffect } from 'react';
import { useUpdateLink } from '../../hooks/useLinks';
import { validateUrl } from '../../utils/validateUrl';
import { fileToDataUrl, COMMON_COLORS } from '../../utils/linkPersonalization';
import type { LinkResponse } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Save, X, Image as ImageIcon } from 'lucide-react';

interface EditLinkDialogProps {
  linkResponse: LinkResponse;
  onClose: () => void;
}

export default function EditLinkDialog({ linkResponse, onClose }: EditLinkDialogProps) {
  const { id, link } = linkResponse;
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(link.image || null);
  const [imageData, setImageData] = useState<string | null>(link.image || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(link.color || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: updateLink, isPending, error } = useUpdateLink();

  useEffect(() => {
    setUrl(link.url);
    setTitle(link.title);
    setDescription(link.description || '');
    setImagePreview(link.image || null);
    setImageData(link.image || null);
    setSelectedColor(link.color || null);
  }, [link]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setValidationError('Image size must be less than 2MB');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageData(dataUrl);
      setImagePreview(dataUrl);
      setValidationError(null);
    } catch (err) {
      setValidationError('Failed to process image');
    }
  };

  const handleClearImage = () => {
    setImageData(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const urlError = validateUrl(url);
    if (urlError) {
      setValidationError(urlError);
      return;
    }

    if (!title.trim()) {
      setValidationError('Please enter a title for your link');
      return;
    }

    updateLink(
      {
        id,
        link: {
          url: url.trim(),
          title: title.trim(),
          description: description.trim() || undefined,
          image: imageData || undefined,
          color: selectedColor || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription className="text-foreground">Update the details of your saved link</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL *</Label>
              <Input
                id="edit-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Link"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image (optional)</Label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg border border-border object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={handleClearImage}
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isPending}
                    className="cursor-pointer"
                  />
                  <ImageIcon className="h-5 w-5 text-foreground/50" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Color (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    disabled={isPending}
                    className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                {selectedColor && (
                  <button
                    type="button"
                    onClick={() => setSelectedColor(null)}
                    disabled={isPending}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border bg-background transition-all hover:scale-110"
                    title="Clear color"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {(validationError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationError || (error instanceof Error ? error.message : 'Failed to update link')}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
