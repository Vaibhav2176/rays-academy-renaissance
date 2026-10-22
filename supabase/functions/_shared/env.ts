// Shared environment variable resolver for Edge Functions.
// Prefers Deno.env (standard container/production environment).
// In local development/test environments (where SUPABASE_URL points to local Kong/Docker),
// provides fallback test gateway configuration so integration tests can run deterministically
// without depending on external network access or real merchant credentials.
// In production (cloud supabase.co URLs), strictly fails closed if secrets are absent.

const localTestConfig: Record<string, string> = {
  RAZORPAY_KEY_ID: "rzp_test_local_dummy_key",
  RAZORPAY_KEY_SECRET: "test_razorpay_secret_123",
  RAZORPAY_WEBHOOK_SECRET: "test_webhook_secret_123",
  RAZORPAY_MOCK_OUTBOUND: "true",
};

export function isLocalEnvironment(): boolean {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  return (
    supabaseUrl.includes("kong:8000") ||
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost")
  );
}

export function getFunctionEnv(key: string): string | undefined {
  const fromDeno = Deno.env.get(key);
  if (fromDeno !== undefined && fromDeno !== "") {
    return fromDeno;
  }

  if (isLocalEnvironment() && key in localTestConfig) {
    return localTestConfig[key];
  }

  return undefined;
}

