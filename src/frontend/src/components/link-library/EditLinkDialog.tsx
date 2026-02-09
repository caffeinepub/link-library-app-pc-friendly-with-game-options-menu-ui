import { useState, useEffect } from 'react';
import { useUpdateLink } from '../../hooks/useLinks';
import { validateUrl } from '../../utils/validateUrl';
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
import { Loader2, AlertCircle, Save } from 'lucide-react';

interface EditLinkDialogProps {
  link: {
    url: string;
    title: string;
    description?: string;
  };
  onClose: () => void;
}

export default function EditLinkDialog({ link, onClose }: EditLinkDialogProps) {
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: updateLink, isPending, error } = useUpdateLink();

  useEffect(() => {
    setUrl(link.url);
    setTitle(link.title);
    setDescription(link.description || '');
  }, [link]);

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

    // Use original URL as ID
    const id = link.url;
    updateLink(
      {
        id,
        link: {
          url: url.trim(),
          title: title.trim(),
          description: description.trim() || undefined,
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
