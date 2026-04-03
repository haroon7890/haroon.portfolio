type MonitoringPayload = {
  scope: string;
  error: unknown;
  metadata?: Record<string, unknown>;
};

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function captureError({ scope, error, metadata }: MonitoringPayload): string {
  const errorId = randomId();

  console.error("[monitoring]", {
    errorId,
    scope,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    metadata,
  });

  return errorId;
}
