/**
 * Utility to optimize Cloudinary and remote image URLs with auto format, quality, and width transforms.
 *
 * @param {string} url - The raw image URL
 * @param {number} [width=800] - Target width for Cloudinary image transformation
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(url, width = 800) {
  if (!url) return '';
  const cleanUrl = url.replace(/['"]/g, '').trim();

  // Handle Cloudinary URLs
  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/upload/')) {
    if (!cleanUrl.includes('/f_auto') && !cleanUrl.includes('/q_auto')) {
      return cleanUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
  }

  // Handle Unsplash URLs
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const u = new URL(cleanUrl);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('q', '80');
      if (width) u.searchParams.set('w', width.toString());
      return u.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}
