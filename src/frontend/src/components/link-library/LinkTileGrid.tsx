import type { LinkResponse } from '../../backend';
import LinkTile from './LinkTile';
import { Link as LinkIcon } from 'lucide-react';

interface LinkTileGridProps {
  links: LinkResponse[];
}

export default function LinkTileGrid({ links }: LinkTileGridProps) {
  if (links.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-card p-8">
        <div className="text-center">
          <LinkIcon className="mx-auto h-12 w-12 text-foreground/50" />
          <p className="mt-4 text-foreground">No links saved yet</p>
          <p className="text-sm text-foreground">Add your first link above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {links.map((linkResponse) => (
        <LinkTile key={linkResponse.id} linkResponse={linkResponse} />
      ))}
    </div>
  );
}
