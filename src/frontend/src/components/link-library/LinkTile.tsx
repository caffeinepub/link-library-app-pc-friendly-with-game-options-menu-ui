import { useState } from 'react';
import type { LinkResponse } from '../../backend';
import { getInitials, getTileColorStyle } from '../../utils/linkPersonalization';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import EditLinkDialog from './EditLinkDialog';
import ConfirmDialog from '../common/ConfirmDialog';

interface LinkTileProps {
  linkResponse: LinkResponse;
}

export default function LinkTile({ linkResponse }: LinkTileProps) {
  const { id, link } = linkResponse;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const colorStyle = getTileColorStyle(link.color);
  const initials = getInitials(link.title);

  return (
    <>
      <div
        className="group relative flex h-40 flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-ring"
        style={{
          backgroundColor: colorStyle.backgroundColor,
          borderColor: colorStyle.borderColor,
        }}
      >
        {/* Main clickable area */}
        <button
          onClick={handleOpen}
          className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center focus:outline-none"
        >
          {/* Image or initials */}
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-background/20">
            {link.image ? (
              <img
                src={link.image}
                alt={link.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{initials}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-white">
            {link.title}
          </h3>
        </button>

        {/* Action buttons - visible on hover */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(true);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* External link indicator */}
        <div className="absolute bottom-2 right-2 opacity-50">
          <ExternalLink className="h-3 w-3 text-white" />
        </div>
      </div>

      {isEditing && (
        <EditLinkDialog
          linkResponse={linkResponse}
          onClose={() => setIsEditing(false)}
        />
      )}

      {isDeleting && (
        <ConfirmDialog
          title="Delete Link"
          description="Are you sure you want to delete this link? This action cannot be undone."
          linkId={id}
          onClose={() => setIsDeleting(false)}
        />
      )}
    </>
  );
}
