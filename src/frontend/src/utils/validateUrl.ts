/**
 * Validates a URL string and returns an error message if invalid
 * @param url - The URL string to validate
 * @returns Error message if invalid, null if valid
 */
export function validateUrl(url: string): string | null {
  if (!url || !url.trim()) {
    return 'URL is required';
  }

  const trimmedUrl = url.trim();

  // Check if URL starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return 'URL must start with http:// or https://';
  }

  // Try to parse the URL
  try {
    const parsedUrl = new URL(trimmedUrl);
    
    // Check if hostname exists
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
      return 'Invalid URL: missing hostname';
    }

    // Check if hostname has at least one dot (basic domain validation)
    if (!parsedUrl.hostname.includes('.') && parsedUrl.hostname !== 'localhost') {
      return 'Invalid URL: hostname must be a valid domain';
    }

    return null;
  } catch (error) {
    return 'Invalid URL format';
  }
}
