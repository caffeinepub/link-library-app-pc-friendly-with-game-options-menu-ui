import { useState } from 'react';
import { useAddLink } from '../../hooks/useLinks';
import { validateUrl } from '../../utils/validateUrl';
import { fileToDataUrl, COMMON_COLORS } from '../../utils/linkPersonalization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

export default function LinkForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: addLink, isPending, error } = useAddLink();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
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

    const id = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    addLink(
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
          setUrl('');
          setTitle('');
          setDescription('');
          setImageData(null);
          setImagePreview(null);
          setSelectedColor(null);
        },
      }
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Link
        </CardTitle>
        <CardDescription className="text-foreground">Save a new link to your library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Link"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
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
                  id="image"
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
                {validationError || (error instanceof Error ? error.message : 'Failed to add link')}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
