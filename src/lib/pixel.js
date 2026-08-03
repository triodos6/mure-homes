export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
  if (typeof window !== 'undefined' && window.ttq?.page) {
    window.ttq.page();
  }
};

export const event = (name, options = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, options);
  }
  if (typeof window !== 'undefined' && window.ttq?.track) {
    window.ttq.track(name, options);
  }
};
