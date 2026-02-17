import {
  MyErrorResponseType,
  SubscriptionRequiredError,
  UnauthorizedError,
  ValidationError,
} from "@/types/errors";
import { logError } from "./shared";

function jsonError(
  code: MyErrorResponseType["code"],
  message: MyErrorResponseType["message"],
  data: MyErrorResponseType["data"],
  status: MyErrorResponseType["status"]
): Response {
  const response: MyErrorResponseType = { code, message, data, status };
  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Z.ai / GLM rate limit error codes
const AI_PROVIDER_RATE_LIMIT_CODES = new Set([
  "1302", // High concurrency
  "1303", // High frequency
  "1304", // Daily limit reached
  "1305", // Rate limit triggered
  "1308", // Usage limit reached
  "1310", // Weekly/monthly limit exhausted
]);

/**
 * Detects AI provider rate limit errors from Z.ai/GLM.
 *
 * The AI SDK throws `APICallError` with:
 *   - `statusCode: number` (e.g. 429)
 *   - `data: unknown` (parsed JSON response body)
 *   - `responseBody: string` (raw response text)
 *   - `message: string` (error description)
 *
 * Z.ai returns 429 with `{ error: { code: "1302", message: "..." } }`.
 */
export function isAIProviderRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  // The AI SDK's APICallError exposes statusCode and data as own properties.
  // We use duck-typing to avoid importing the class (it's in @ai-sdk/provider).
  const err = error as unknown as Record<string, unknown>;

  // Check HTTP 429 status (primary signal)
  if (typeof err.statusCode === "number" && err.statusCode === 429) {
    return true;
  }

  // Check Z.ai-specific error codes in parsed response data
  if (err.data && typeof err.data === "object") {
    const data = err.data as Record<string, unknown>;
    // Shape: { error: { code: "1302", ... } }
    const errorObj = data.error as Record<string, unknown> | undefined;
    const code = errorObj?.code?.toString() ?? (data.code as string | undefined)?.toString();
    if (code && AI_PROVIDER_RATE_LIMIT_CODES.has(code)) return true;
  }

  // Check raw responseBody if data wasn't parsed
  if (typeof err.responseBody === "string") {
    try {
      const parsed = JSON.parse(err.responseBody);
      const code = parsed?.error?.code?.toString() ?? parsed?.code?.toString();
      if (code && AI_PROVIDER_RATE_LIMIT_CODES.has(code)) return true;
    } catch {
      // Not JSON
    }
  }

  // Fallback: check message text for rate-limit indicators
  const message = error.message?.toLowerCase() ?? "";
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return true;
  }

  return false;
}

export function handleError(error: unknown, context: Record<string, unknown> = {}): Response {
  if (error instanceof ValidationError) {
    return jsonError("VALIDATION_ERROR", error.message, { details: error.details }, 400);
  }

  if (error instanceof SubscriptionRequiredError) {
    return jsonError("SUBSCRIPTION_REQUIRED", error.message, error.data, 402);
  }

  if (error instanceof UnauthorizedError) {
    return jsonError("UNAUTHORIZED", error.message, undefined, 401);
  }

  if (isAIProviderRateLimitError(error)) {
    return jsonError(
      "AI_PROVIDER_UNAVAILABLE",
      "AI service is temporarily busy. Please try again in a few minutes.",
      undefined,
      429
    );
  }

  logError(error as Error, context);
  return new Response("Internal Server Error", { status: 500 });
}
