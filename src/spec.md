# Specification

## Summary
**Goal:** Let users personalize saved links with an optional image and color, and display links as app-like tiles with hover/focus interactions while fixing link identity for reliable edit/delete.

**Planned changes:**
- Extend the backend link model to persist optional per-link image (as text) and color (as text) per user alongside existing link fields.
- Return stable link identifiers from the backend and update the frontend to use these ids for edit/delete (not URL or array index).
- Update the Add Link form to support optional image upload (with preview and clear/replace) and a common-color picker, submitting these values when provided.
- Update the Edit Link dialog to display/change/remove the link image and change the selected color, saving via the existing update flow using stable ids.
- Replace/augment the saved-links list with a compact tile (grid/minimized) view: show the link image when present, otherwise show a title-derived fallback avatar; apply the per-link color while keeping the permanently dark theme readable.
- Add desktop hover and keyboard focus-visible styling to tiles to visually elevate/highlight without breaking accessibility or click targets; keep open/edit/delete actions available.

**User-visible outcome:** Users can add/edit/remove an image and choose a color for each saved link, see links in an app-like tile grid with image or title-based fallback avatars, and interact with tiles via hover/focus while edit/delete consistently targets the correct link.
