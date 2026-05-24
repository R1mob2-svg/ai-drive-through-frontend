/**
 * Meta Pixel helper – fires fbq events when the pixel is loaded.
 * Safe to call even if the pixel script hasn't loaded yet.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};

/** Convenience wrappers */
export const trackLead = (source?: string) =>
  trackMetaEvent("Lead", source ? { content_name: source } : undefined);

export const trackContact = (source?: string) =>
  trackMetaEvent("Contact", source ? { content_name: source } : undefined);

export const trackCompleteRegistration = (source?: string) =>
  trackMetaEvent("CompleteRegistration", source ? { content_name: source } : undefined);
