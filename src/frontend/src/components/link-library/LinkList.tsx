import { useState } from 'react';
import type { Link } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import EditLinkDialog from './EditLinkDialog';
import ConfirmDialog from '../common/ConfirmDialog';

interface LinkListProps {
  links: Link[];
}

export default function LinkList({ links }: LinkListProps) {
  const [editingLink, setEditingLink] = useState<{ url: string; title: string; description?: string } | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (links.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <LinkIcon className="mx-auto h-12 w-12 text-foreground/50" />
            <p className="mt-4 text-foreground">No links saved yet</p>
            <p className="text-sm text-foreground">Add your first link above to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex h-full flex-col border-border bg-card">
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription className="text-foreground">{links.length} link{links.length !== 1 ? 's' : ''} saved</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6 pb-6">
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/50 hover:bg-card focus-within:ring-2 focus-within:ring-ring"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{link.title}</h3>
                      <p className="mt-1 truncate text-sm text-foreground">{link.url}</p>
                      {link.description && (
                        <p className="mt-2 text-sm text-foreground">{link.description}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpen(link.url)}
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingLink(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingUrl(link.url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {editingLink && (
        <EditLinkDialog
          link={editingLink}
          onClose={() => setEditingLink(null)}
        />
      )}

      {deletingUrl && (
        <ConfirmDialog
          title="Delete Link"
          description="Are you sure you want to delete this link? This action cannot be undone."
          linkUrl={deletingUrl}
          onClose={() => setDeletingUrl(null)}
        />
      )}
    </>
  );
}
