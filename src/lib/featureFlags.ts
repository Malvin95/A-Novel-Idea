export function shouldUseMock(endpointName: string): boolean {
  try {
    const per = process.env.FEATURE_FLAGS_JSON;
    if (per) {
      const flags = JSON.parse(per);
      if (Object.prototype.hasOwnProperty.call(flags, endpointName)) {
        return Boolean(flags[endpointName]);
      }
    }
  } catch (e) {
    // ignore parse errors and fall back to globals
  }

  const globalToggle = (process.env.USE_MOCKS ?? "").toLowerCase();
  if (globalToggle === "true") return true;
  if (globalToggle === "false") return false;

  // default: use mocks in development
  if ((process.env.NODE_ENV ?? "").toLowerCase() !== "production") return true;

  // allow forced mocking in production via DEV_ALWAYS_MOCK
  if ((process.env.DEV_ALWAYS_MOCK ?? "").toLowerCase() === "true") return true;

  return false;
}

export default shouldUseMock;
