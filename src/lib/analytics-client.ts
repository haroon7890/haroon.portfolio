type EventMetadata = Record<string, unknown>;

export function trackEvent(name: string, metadata?: EventMetadata): void {
  void name;
  void metadata;
  // Analytics disabled.
}
