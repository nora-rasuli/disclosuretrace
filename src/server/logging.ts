export function logApiResult(input: {
  route: string;
  comparisonId?: string;
  status: number;
  latencyMs: number;
  errorCode?: string;
}) {
  const record = {
    event: "fixture_api_request",
    requestId: crypto.randomUUID(),
    fixtureVersion: "v1",
    ...input,
  };
  if (input.status >= 500) console.error(JSON.stringify(record));
}
