import { useState } from 'react';
import { useAddLink } from '../../hooks/useLinks';
import { validateUrl } from '../../utils/validateUrl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export default function LinkForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: addLink, isPending, error } = useAddLink();

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
        },
      },
      {
        onSuccess: () => {
          setUrl('');
          setTitle('');
          setDescription('');
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
