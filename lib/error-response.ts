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

function isAIProviderRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message?.toLowerCase() ?? "";
  // Check for HTTP 429 status in error
  if (message.includes("429") || message.includes("rate limit") || message.includes("too many")) {
    return true;
  }

  // Check for Z.ai specific error codes in the message body
  try {
    const parsed = JSON.parse(error.message);
    const code = parsed?.error?.code?.toString() ?? parsed?.code?.toString();
    if (code && AI_PROVIDER_RATE_LIMIT_CODES.has(code)) return true;
  } catch {
    // Not JSON, that's fine
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
