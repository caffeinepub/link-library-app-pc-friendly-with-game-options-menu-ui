import { useGetAllLinks } from '../../hooks/useLinks';
import LinkForm from './LinkForm';
import LinkTileGrid from './LinkTileGrid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LinkLibraryPanel() {
  const { data: links, isLoading, error } = useGetAllLinks();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-foreground">Loading your links...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load links: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <div className="mx-auto w-full max-w-4xl">
        <LinkForm />
      </div>
      <div className="mx-auto w-full max-w-7xl flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pb-6">
            <LinkTileGrid links={links || []} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
